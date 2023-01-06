using AutoMapper;
using Clicker.Backend.Common.UseCases;
using Clicker.Backend.Endpoints;
using Clicker.Backend.Extensions;
using MediatR;

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