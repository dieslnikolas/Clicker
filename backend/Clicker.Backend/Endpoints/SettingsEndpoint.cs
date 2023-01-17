using Clicker.Backend.Commands.Settings;
using Clicker.Backend.Common.Endpoints;
using Clicker.Backend.Common.Requests;
using Clicker.Backend.Common.Responses;
using Clicker.Backend.Models;

namespace Clicker.Backend.Endpoints;

public class SettingsEndpoint : IEndpoint
{
    private const string GroupName = "Settings";
    
    public void RegisterRoutes(WebApplication app)
    {
        // New
        app.MapPost("/Settings", 
                async (SettingsPostRequest request, RequestContext ctx) =>
                await ctx.SendCommand<SettingsInsertCommand, SettingsPostResponse>(request))
            .RequireAuthorization()
            .WithTags(GroupName)
            .WithDescription("New custom settings")
            .Produces<SettingsPostResponse>();
        
        // Detail
        app.MapGet("/Settings", 
                async ([AsParameters] SettingsDetailRequest request, RequestContext ctx) =>
                    await ctx.SendQuery<SettingsDetailQuery, SettingsDetailResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Settings value")
            .Produces<SettingsDetailResponse>();
        
        // Edit
        app.MapPatch("/Settings", 
                async (SettingsEditRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<SettingsEditCommand, SettingsEditResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Edit settings value")
            .Produces<SettingsEditResponse>();
        
        // Delete
        app.MapDelete( "/Settings", 
                async ([AsParameters] SettingsDeleteRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<SettingsDeleteCommand, SettingsDeleteResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Delete custom settings")
            .Produces<SettingsDeleteResponse>();
    }
}

public record SettingsPostRequest(string Key, string? Name);
public record SettingsPostResponse() : IApiResponse;

public record SettingsDetailRequest(string Key);
public record SettingsDetailResponse(string Key, string Name, IList<Script> Scripts, IList<Dictionary<string, object>> Data) : IApiResponse;

public record SettingsEditRequest(string Name, string Key);
public record SettingsEditResponse : IApiResponse;

public record SettingsDeleteRequest(string Key);
public record SettingsDeleteResponse : IApiResponse;