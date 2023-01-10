using AutoMapper;
using Clicker.Backend.Endpoints;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptMappingProfile : Profile
{
    public ScriptMappingProfile()
    {
        // HTTP > MEDIATR
        CreateMap<ScriptPostRequest, ScriptInsertCommand>();
        CreateMap<ScriptDetailRequest, ScriptDetailQuery>();
        CreateMap<ScriptDeleteRequest, ScriptDeleteCommand>();
        CreateMap<ScriptEditRequest, ScriptEditCommand>();
        
        // MEDIATR > HTTP
        CreateMap<ScriptInsertCommandModel, ScriptPostResponse>();
        CreateMap<ScriptDetailQueryModel, ScriptDetailResponse>();
        CreateMap<ScriptDeleteCommandModel, ScriptDeleteResponse>();
        CreateMap<ScriptEditCommandModel, ScriptEditResponse>();
    } 
}