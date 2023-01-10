using System.Globalization;
using System.Reflection;
using System.Text;
using Clicker.Backend.Common;
using Clicker.Backend.Common.Authorizations;
using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;
using Clicker.Backend.Common.Extensions;
using Clicker.Backend.Common.PipelineBehaviours;
using Clicker.Backend.Common.Requests;
using MediatR;
using Clicker.Backend.Settings;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TypeExtensions = Clicker.Backend.Common.Extensions.TypeExtensions;

namespace Clicker.Backend;

public static class DependencyInjection
{
    public static IServiceCollection AddWebApi(this IServiceCollection services)
    {
        // API EACH HTTP request context
        services.AddScoped<RequestContext>();

        return services;
    }

    public static IServiceCollection AddDb(this IServiceCollection services)
    {
        // Settings wrapper - it must keep filepath (project path) 4EVER
        services.AddScoped<IDbContext, DbContext>();

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
        var validatorTypes = TypeExtensions.GetValidators();

        // 2) Register specific validators to specific command/query
        foreach (var validator in validatorTypes)
        {
            services.AddScoped(validator.GetValidatorInterface()!, validator);
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
        services

            // Authentication
            // You dont need to be that specific in net 7, but who cares for now
            .AddAuthentication(options => JwtAuthorization.SetupDefaultSchemes(options))

            // JWT
            .AddJwtBearer(options => JwtAuthorization.SetupJwtRequirements(options, cfg));

        // Authorization support
        services.AddAuthorization();

        // Return
        return services;
    }

}