using Clicker.Backend.Endpoints;

namespace Clicker.Backend.Common;

public static class WebApplicationExtensions
{
    /// <summary>
    /// Register endpoints
    /// </summary>
    /// <param name="app"></param>
    /// <returns></returns>
    public static void RegisterEndpoints(this WebApplication app)
    {
        ScriptEndpoint.RegisterRoutes(app);
        ConfigurationEndpoint.RegisterRoutes(app);
        ModuleEndpoint.RegisterRoutes(app);
        ProjectEndpoint.RegisterRoutes(app);
    }
}