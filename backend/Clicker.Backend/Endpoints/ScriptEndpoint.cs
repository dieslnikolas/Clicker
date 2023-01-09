using Clicker.Backend.Common;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Endpoints;

public static class ScriptEndpoint
{
    public static void RegisterRoutes(WebApplication app)
    {
        // app.MapGet("/Script", async ([AsParameters] ScriptRequest request, Context ctx) => await ctx.SendQuery<ScriptGetQuery, ScriptResponse>(request));
        // app.MapPost("/Script", async (ScriptRequest request, Context ctx) => await ctx.SendCommand<ScriptInsertCommand, ScriptResponse>(request));
        // app.MapPost("/Script/Run", async (ScriptRequest request, Context ctx) => await ctx.SendCommand<ScriptRunCommand, ScriptResponse>(request));
        // app.MapPatch("/Script", async (ScriptRequest request, Context ctx) => await ctx.SendCommand<ScriptUpdateCommand, ScriptResponse>(request));
        // app.MapDelete("/Script", async ([AsParameters] ScriptRequest request, Context ctx) => await ctx.SendCommand<ScriptDeleteCommand, ScriptResponse>(request));
    }
}

/// <summary>
/// Scripts for modules and global scripts
/// </summary>
/// <param name="Name">Command name - Displayname</param>
/// <param name="Id">System ID</param>
/// <param name="IsDefault">Double click default value - works only for module commands</param>
/// <param name="IsContext">If its context or global script</param>
/// <param name="IsImport">Is command for importing data</param>
public record ScriptRequest(
    string Name,
    string? Id,
    bool? IsDefault,
    bool? IsContext,
    bool? IsImport
);

public record ScriptResponse : IApiResponse
{
}