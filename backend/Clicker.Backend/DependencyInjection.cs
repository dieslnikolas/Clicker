using System.Globalization;
using System.Reflection;
using System.Text;
using Clicker.Backend.Common;
using Clicker.Backend.Common.Authorization;
using MediatR;
using Clicker.Backend.Common.UseCases;
using Clicker.Backend.PipelineBehaviours;
using Clicker.Backend.Settings;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Clicker.Backend;

public static class DependencyInjection
{
    public static IServiceCollection AddApi(this IServiceCollection services)
    {
        // API EACH HTTP request context
        services.AddScoped<Context>();

        // Settings wrapper - it must keep filepath (project path) 4EVER
        services.AddScoped<IDbContext, ConfigNetWrapper>();

        return services;
    }

    /// <summary>
    /// Register endpoints
    /// </summary>
    /// <param name="services"></param>
    /// <returns></returns>
    public static IServiceCollection AddMediator(this IServiceCollection services)
    {
        // Mediator
        services.AddScoped(typeof(ICommonHandlerContext<>), typeof(CommonHandlerContext<>));
        services.AddMediatR(Assembly.GetExecutingAssembly());

        // Add Pipeline behaviours
        // Pipelines will be executed in order in which they were registered
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

        return services;
    }

    /// <summary>
    /// Prida Fluent Validations
    /// </summary>
    /// <param name="services"></param>
    public static IServiceCollection AddValidators(this IServiceCollection services)
    {
        // 1) Find all validators of the type except base/abstract
        var abstractValidatorType = typeof(Common.Validations.Validator<>);

        var validatorTypes = abstractValidatorType
            .Assembly
            .GetTypes()
            .Where(oneClass => oneClass.IsSubclassOfRawGeneric(abstractValidatorType) && !oneClass.IsAbstract);

        // 2) Register specific validators to specific command/query
        foreach (var validator in validatorTypes)
        {
            var commandOrQueryType = GetCommandOrQueryType(validator, typeof(Common.Validations.IClickerValidator<>));
            services.AddScoped(commandOrQueryType, validator);
        }

        // Default language
        ValidatorOptions.Global.LanguageManager.Culture = new CultureInfo("en");

        return services;
    }

    /// <summary>
    /// Helper metod for adding swagger desc
    /// </summary>
    /// <param name="services"></param>
    /// <returns></returns>
    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });

        return services;
    }

    public static IServiceCollection AddJWTSupport(this IServiceCollection services, IConfiguration cfg)
    {
        // You dont need to be that specific in net 7, but who cares for now
        // Authentication
        services.AddAuthentication(config =>
            {
                config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                config.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                config.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })

            // JWT
            .AddJwtBearer(config =>
            {
                // Allow HTTPS token (bad and ugly)
                config.RequireHttpsMetadata = false;
                config.SaveToken = true;
                config.TokenValidationParameters = new TokenValidationParameters
                {
                    // Key
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Jwt.GetSecret(cfg)),
                    
                    // Isuer
                    ValidateIssuer = true,
                    ValidIssuer = Jwt.GetIssuer(cfg),
                    
                    // Audience
                    ValidateAudience = true,
                    ValidAudience = Jwt.GetAudience(cfg)
                };
            });

        // Authorization support
        services.AddAuthorization();

        // Return
        return services;
    }

    #region Private methods

    /// <summary>
    /// Returns command or query (T generic validator type)
    /// </summary>
    /// <param name="implementation"></param>
    /// <param name="validatorType"></param>
    /// <returns></returns>
    private static Type GetCommandOrQueryType(Type implementation, Type validatorType)
    {
        // Find all impelentations of type
        Type resolvedType = null;
        if (implementation.BaseType != null)
        {
            var cmdType = implementation.BaseType.GenericTypeArguments[0];
            resolvedType = validatorType.MakeGenericType(cmdType);
        }

        // Check
        if (resolvedType == null)
        {
            throw new Exception(string.Format("Cant resolve interface type {validatorType} for {implementation}", validatorType, implementation));
        }

        return resolvedType;
    }

    /// <summary>
    /// Alternative version of <see cref="Type.IsSubclassOf"/> that supports raw generic types (generic types without
    /// any type parameters).
    /// </summary>
    /// <param name="parentClass">The base type class for which the check is made.</param>
    /// <param name="derivedClass">To type to determine for whether it derives from <paramref name="parentClass"/>.</param>
    private static bool IsSubclassOfRawGeneric(this Type derivedClass, Type parentClass)
    {
        while (derivedClass != typeof(object) && derivedClass != null)
        {
            var cur = derivedClass.IsGenericType ? derivedClass.GetGenericTypeDefinition() : derivedClass;
            if (parentClass == cur)
            {
                return true;
            }

            derivedClass = derivedClass.BaseType;
        }

        return false;
    }

    #endregion
}