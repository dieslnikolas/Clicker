using System.Reflection;
using MediatR;
using Clicker.Backend.Common;
using Clicker.Backend.Common.UseCases;
using Clicker.Backend.PipelineBehaviours;
using Clicker.Backend.Repositories.Module;
using Clicker.Backend.Repositories.Project;
using Clicker.Backend.Repositories.User;

namespace Clicker.Backend;

public static class DependencyInjection
{
    /// <summary>
    /// Register endpoints
    /// </summary>
    /// <param name="services"></param>
    /// <returns></returns>
    public static IServiceCollection AddEndpoints(this IServiceCollection services)
    {
        services.AddTransient<IEndpoint, Endpoints.Script>();
        services.AddTransient<IEndpoint, Endpoints.Configuration>();
        services.AddTransient<IEndpoint, Endpoints.Module>();
        services.AddTransient<IEndpoint, Endpoints.Project>();

        return services;
    }
    
    /// <summary>
    /// Register endpoints
    /// </summary>
    /// <param name="services"></param>
    /// <returns></returns>
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IModuleRepository, ModuleRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

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
        var abstractValidatorType = typeof(Common.Validations.ValidatorBase<>);

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