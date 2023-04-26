using AutoMapper;
using Clicker.Backend.Endpoints;

namespace Clicker.Backend.Commands.User;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // HTTP > MEDIATR
        CreateMap<UserDetailRequest, UserDetailQuery>();
        CreateMap<UserDeleteRequest, UserDeleteCommand>();
        CreateMap<UserEditRequest, UserEditCommand>();
        
        // MEDIATR > HTTP
        CreateMap<UserDetailQueryModel, UserDetailResponse>();
        CreateMap<UserDeleteCommandModel, UserDeleteResponse>();
        CreateMap<UserEditCommandModel, UserEditResponse>();
    } 
}