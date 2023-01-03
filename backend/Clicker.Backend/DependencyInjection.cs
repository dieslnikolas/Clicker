using System.Reflection;
using MediatR;
using Clicker.Backend.Common;
using Clicker.Backend.PipelineBehaviours;

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
        services.AddTransient<IEndpoint, Endpoints.Command>();
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
    public static IServiceCollection AddMediatR(this IServiceCollection services)
    {
        
        // Mediator
        services.AddMediatR(Assembly.GetExecutingAssembly());

        // Add Pipeline behaviours
        // Pipelines will be executed in order in which they were registered
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingPipeline<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ExceptionPipeline<,>));

        
        return services;
    }  
    
  
}