using Clicker.Backend.Common;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Endpoints;

public static class ModuleEndpoint
{
    public static void RegisterRoutes(WebApplication app)
    {
        // app.MapGet("/Module", (string? id) => new ModuleResponse());
        // app.MapPost("/Module", (ModuleRequest request) => new ModuleResponse());
        // app.MapPatch("/Module", (ModuleRequest request) => Results.Ok());
        // app.MapDelete("/Module", (string? id) => Results.Ok());
    }
}

/// <summary>
/// Module
/// </summary>
/// <param name="Name">Name how person would call it</param>
/// <param name="Key">Key how system would describe it</param>
/// <param name="Data">Data - basically JSON array</param>
public record ModuleRequest(
    string Name,
    string Key,
    IList<Dictionary<string, object>> Data
);

public record ModuleResponse : IApiResponse
{
}