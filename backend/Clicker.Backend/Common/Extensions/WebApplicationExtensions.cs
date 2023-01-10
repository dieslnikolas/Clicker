using Clicker.Backend.Common.Endpoints;

namespace Clicker.Backend.Common.Extensions;

public static class WebApplicationExtensions
{
    /// <summary>
    /// Register endpoints
    /// <returns></returns>
    public static void RegisterEndpoints(this WebApplication app)
    {
        // Get all implementations of IEndpoint
        var endpointInterface = typeof(IEndpoint);
        var interfaces = endpointInterface.Assembly
            .GetTypes()
            .Where(p => endpointInterface.IsAssignableFrom(p) && !p.IsInterface);

        // Activate endpoints
        foreach (var item in interfaces)
        {
            var instance = (IEndpoint)Activator.CreateInstance(item)!;
            instance.RegisterRoutes(app);
        }
    }
}