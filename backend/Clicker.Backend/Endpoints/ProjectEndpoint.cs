using Clicker.Backend.Common;
using Clicker.Backend.UseCases.Project;
using Microsoft.AspNetCore.Authorization;

namespace Clicker.Backend.Endpoints;

public static class ProjectEndpoint
{
    public static void RegisterRoutes(WebApplication app)
    {
        app.MapPost("/Project", 
                async (ProjectRequest request, Context ctx) =>
                await ctx.SendCommand<ProjectInsertCommand, ProjectResponse>(request))
            .AllowAnonymous()
            .Produces<ProjectResponse>();
        
    }
}

/// <summary>
/// Project 
/// </summary>
/// <param name="Id"></param>
/// <param name="Author"></param>
/// <param name="Path"></param>
/// <param name="Key"></param>
public record ProjectRequest(string Id, string? Author, string Path, string Key);

/// <summary>
/// Project response is empty if everything is OK, otherwise Error or Valdation message
/// </summary>
/// <param name="JWT">Token</param>
public record ProjectResponse(string JWT) : IApiResponse
{
}