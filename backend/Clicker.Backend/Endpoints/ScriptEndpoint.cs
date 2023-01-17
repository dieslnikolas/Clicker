using Clicker.Backend.Commands.Scripts;
using Clicker.Backend.Common.Endpoints;
using Clicker.Backend.Common.Requests;
using Clicker.Backend.Common.Responses;

namespace Clicker.Backend.Endpoints;

public class ScriptEndpoint : IEndpoint
{
    private const string GroupName = "Script";
    
    public void RegisterRoutes(WebApplication app)
    {
        // New
        app.MapPost("/Script", 
                async (ScriptPostRequest request, RequestContext ctx) =>
                await ctx.SendCommand<ScriptInsertCommand, ScriptPostResponse>(request))
            .RequireAuthorization()
            .WithTags(GroupName)
            .WithDescription("Create new script")
            .Produces<ScriptPostResponse>();
        
        // Detail
        app.MapGet("/Script", 
                async ([AsParameters] ScriptDetailRequest request, RequestContext ctx) =>
                    await ctx.SendQuery<ScriptDetailQuery, ScriptDetailResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Script detail")
            .Produces<ScriptDetailResponse>();
        
        // Run
        app.MapGet("/Script/Run", 
                async ([AsParameters] ScriptRunRequest request, RequestContext ctx) =>
                    await ctx.SendQuery<ScriptRunQuery, ScriptRunResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Run script")
            .Produces<ScriptRunResponse>();
        
        // Edit
        app.MapPatch("/Script", 
                async (ScriptEditRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<ScriptEditCommand, ScriptEditResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Edit script")
            .Produces<ScriptEditResponse>();
        
        // Delete
        app.MapDelete( "/Script", 
                async ([AsParameters] ScriptDeleteRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<ScriptDeleteCommand, ScriptDeleteResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Delete script")
            .Produces<ScriptDeleteResponse>();
    }
}

public record ScriptPostRequest(string Key, string? Name);
public record ScriptPostResponse() : IApiResponse;

public record ScriptDetailRequest(string Key);
public record ScriptDetailResponse(string Key, string Name) : IApiResponse;

public record ScriptRunRequest(string Key);
public record ScriptRunResponse(string Key, string Name) : IApiResponse;

public record ScriptEditRequest(string Name, string Key);
public record ScriptEditResponse : IApiResponse;

public record ScriptDeleteRequest(string Key);
public record ScriptDeleteResponse : IApiResponse;