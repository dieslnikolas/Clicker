using AutoMapper;
using Clicker.Backend.Endpoints;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptMappingProfile : Profile
{
    public ScriptMappingProfile()
    {
        
        // HTTP > MEDIATR
        CreateMap<ScriptRequest, ScriptGetQuery>();
        CreateMap<ScriptRequest, ScriptDeleteCommand>();
        CreateMap<ScriptRequest, ScriptRunCommand>();
        CreateMap<ScriptRequest, ScriptInsertCommand>();
        CreateMap<ScriptRequest, ScriptUpdateCommand>();
        
        // MEDIATR > HTTP
        CreateMap<ScriptGetQueryModel, ScriptResponse>();
        CreateMap<ScriptDeleteCommandModel, ScriptResponse>();
        CreateMap<ScriptRunCommandModel, ScriptResponse>();
        CreateMap<ScriptInsertCommandModel, ScriptResponse>();
        CreateMap<ScriptUpdateCommandModel, ScriptResponse>();
    } 
}