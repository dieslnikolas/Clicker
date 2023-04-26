using Clicker.Backend.Commands.User;
using Clicker.Backend.Common.Endpoints;
using Clicker.Backend.Common.Requests;
using Clicker.Backend.Common.Responses;

namespace Clicker.Backend.Endpoints;

public class UserEndpoint : IEndpoint
{
    private const string GroupName = "User";
    
    public void RegisterRoutes(WebApplication app)
    {
        // Detail
        app.MapGet("/User", 
                async ([AsParameters] UserDetailRequest request, RequestContext ctx) =>
                    await ctx.SendQuery<UserDetailQuery, UserDetailResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("User global settings")
            .Produces<UserDetailResponse>();
        
        // Edit
        app.MapPatch("/User", 
                async (UserEditRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<UserEditCommand, UserEditResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("User global settings edit")
            .Produces<UserEditResponse>();
        
        // Delete
        app.MapDelete( "/User", 
                async ([AsParameters] UserDeleteRequest request, RequestContext ctx) =>
                    await ctx.SendCommand<UserDeleteCommand, UserDeleteResponse>(request))
            .WithTags(GroupName)
            .RequireAuthorization()
            .WithDescription("Delete global settings")
            .Produces<UserDeleteResponse>();
    }
}

public record UserDetailRequest(string Key);
public record UserDetailResponse(string Key, string Name) : IApiResponse;

public record UserEditRequest(string Name, string Key);
public record UserEditResponse : IApiResponse;

public record UserDeleteRequest(string Key);
public record UserDeleteResponse : IApiResponse;