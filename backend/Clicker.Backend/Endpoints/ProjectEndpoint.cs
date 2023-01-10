using Clicker.Backend.Commands.Projects;
using Clicker.Backend.Common;
using Clicker.Backend.Common.Endpoints;
using Clicker.Backend.Common.Requests;
using Clicker.Backend.Common.Responses;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Endpoints;

public class ProjectEndpoint : IEndpoint
{
    private const string GroupName = "Project";
    
    public void RegisterRoutes(WebApplication app)
    {
        // New
        app.MapPost("/Project", 
                async (ProjectPostRequest request, RequestContext ctx) =>
                await ctx.SendCommand<ProjectInsertCommand, ProjectPostResponse>(request))
            .AllowAnonymous()
            .WithTags(GroupName)
            .Produces<ProjectPostResponse>();
        
        // Open
        app.MapGet("/Project/Open", 
                async ([AsParameters] ProjectOpenRequest request, RequestContext ctx) =>
                    await ctx.SendQuery<ProjectOpenQuery, ProjectOpenResponse>(request))
            .AllowAnonymous()
            .WithTags(GroupName)
            .Produces<ProjectOpenResponse>();
        
        // Detail
        app.MapGet("/Project", 
                async ([AsParameters] ProjectDetailRequest request, RequestContext ctx) =>
                    await ctx.SendQuery<ProjectDetailQuery, ProjectDetailResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ProjectDetailResponse>();
        
        // Edit
        app.MapPatch("/Project", 
                async (ProjectEditRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<ProjectEditCommand, ProjectEditResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ProjectEditResponse>();
        
        // Delete
        app.MapDelete( "/Project", 
                async ([AsParameters] ProjectDeleteRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<ProjectDeleteCommand, ProjectDeleteResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ProjectDeleteResponse>();
    }
}

public record ProjectPostRequest(string Id, string? Author, string Path, string Key);
public record ProjectPostResponse(string Jwt) : IApiResponse;

public record ProjectOpenRequest(string Path, string Key);
public record ProjectOpenResponse(string Jwt) : IApiResponse;

public record ProjectDetailRequest();
public record ProjectDetailResponse(string Id, string Author, string Version, IList<IScript> Scripts) : IApiResponse;

public record ProjectEditRequest(string Id, string Author, string Version);
public record ProjectEditResponse : IApiResponse;

public record ProjectDeleteRequest();
public record ProjectDeleteResponse : IApiResponse;