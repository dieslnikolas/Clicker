using Clicker.Backend.Common;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Endpoints;

public static class ProjectEndpoint 
{
    public static void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Project", () => new ProjectResponse());
        // app.MapPost("/Project", async (ProjectRequest request, Context ctx) => await ctx.SendCommand<commnd, ProjectResponse>(request));
        app.MapPatch("/Project", (ProjectRequest request) => Results.Ok());
        app.MapDelete("/Project", () => Results.Ok());
    }
}


public record ProjectRequest(string DisplayName);
public record ProjectResponse : IApiResponse
{
    public Exception Exception { get; set; }
    public IList<ValidationMessage> Validation { get; set; }
}

