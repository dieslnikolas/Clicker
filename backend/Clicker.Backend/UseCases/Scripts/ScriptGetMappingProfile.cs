using AutoMapper;
using Clicker.Backend.Endpoints;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptGetQueryMappingProfile : Profile
{
    public ScriptGetQueryMappingProfile()
    {
        CreateMap<ScriptRequest, ScriptGetQuery>();
        // CreateMap<CommandQuery, CommandService>();
        CreateMap<ScriptGetModel, ScriptResponse>();
    } 
}