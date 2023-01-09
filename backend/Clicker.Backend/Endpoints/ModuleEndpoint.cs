using Clicker.Backend.Common;
using Clicker.Backend.Settings;
using Clicker.Backend.UseCases.Module;

namespace Clicker.Backend.Endpoints;

public static class ModuleEndpoint
{
    private const string GroupName = "Module";
    
    public static void RegisterRoutes(WebApplication app)
    {
        // New Module
        app.MapPost("/Module", 
                async (ModulePostRequest request, Context ctx) =>
                await ctx.SendCommand<ModuleInsertCommand, ModulePostResponse>(request))
            .RequireAuthorization()
            .WithTags(GroupName)
            .Produces<ModulePostResponse>();
        
        // Detail
        app.MapGet("/Module", 
                async ([AsParameters] ModuleDetailRequest request, Context ctx) =>
                    await ctx.SendQuery<ModuleDetailQuery, ModuleDetailResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ModuleDetailResponse>();
        
        // Edit
        app.MapPatch("/Module", 
                async (ModuleEditRequest request, Context ctx) =>
                    await ctx.SendCommand<ModuleEditCommand, ModuleEditResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ModuleEditResponse>();
        
        // Delete
        app.MapDelete( "/Module", 
                async ([AsParameters] ModuleDeleteRequest request, Context ctx) =>
                    await ctx.SendCommand<ModuleDeleteCommand, ModuleDeleteResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .Produces<ModuleDeleteResponse>();
    }
}

public record ModulePostRequest(string Key, string? Name);
public record ModulePostResponse() : IApiResponse;

public record ModuleDetailRequest(string Key);
public record ModuleDetailResponse(string Key, string Name, IList<IScripts> Scripts, IList<Dictionary<string, object>> Data) : IApiResponse;

public record ModuleEditRequest(string Name, string Key);
public record ModuleEditResponse : IApiResponse;

public record ModuleDeleteRequest(string Key);
public record ModuleDeleteResponse : IApiResponse;