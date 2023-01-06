using Clicker.Backend.Common;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Endpoints;

public static class ConfigurationEndpoint
{
    public static void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Configuration", (string? id) => new SettingsResponse());
        app.MapPost("/Configuration", (SettingsRequest request) => new SettingsResponse());
        app.MapPatch("/Configuration", (SettingsRequest request) => Results.Ok());
        app.MapDelete("/Configuration", (string id) => Results.Ok());
    }
}

/// <summary>
/// Represents custom user settings
/// </summary>
/// <param name="Data">settings</param>
public record SettingsRequest(
    Dictionary<string, object> Settings
);

public record SettingsResponse() : IApiResponse
{
    public Exception Exception { get; set; }
    public IList<ValidationMessage> Validation { get; set; }
}