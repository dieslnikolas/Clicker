using Clicker.Backend.Commands.Modules;
using Clicker.Backend.Common.Endpoints;
using Clicker.Backend.Common.Requests;
using Clicker.Backend.Common.Responses;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Endpoints;

public class ModuleEndpoint : IEndpoint
{
    private const string GroupName = "Module";
    
    public void RegisterRoutes(WebApplication app)
    {
        // New
        app.MapPost("/Module", 
                async (ModulePostRequest request, RequestContext ctx) =>
                await ctx.SendCommand<ModuleInsertCommand, ModulePostResponse>(request))
            .RequireAuthorization()
            .WithTags(GroupName)
            .Produces<ModulePostResponse>();
        
        // Detail
        app.MapGet("/Module", 
                async ([AsParameters] ModuleDetailRequest request, RequestContext ctx) =>
                    await ctx.SendQuery<ModuleDetailQuery, ModuleDetailResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ModuleDetailResponse>();
        
        // Edit
        app.MapPatch("/Module", 
                async (ModuleEditRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<ModuleEditCommand, ModuleEditResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ModuleEditResponse>();
        
        // Delete
        app.MapDelete( "/Module", 
                async ([AsParameters] ModuleDeleteRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<ModuleDeleteCommand, ModuleDeleteResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ModuleDeleteResponse>();
    }
}

public record ModulePostRequest(string Key, string? Name);
public record ModulePostResponse() : IApiResponse;

public record ModuleDetailRequest(string Key);
public record ModuleDetailResponse(string Key, string Name) : IApiResponse;

public record ModuleEditRequest(string Name, string Key);
public record ModuleEditResponse : IApiResponse;

public record ModuleDeleteRequest(string Key);
public record ModuleDeleteResponse : IApiResponse;