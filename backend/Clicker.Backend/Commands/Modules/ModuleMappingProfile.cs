using AutoMapper;
using Clicker.Backend.Endpoints;

namespace Clicker.Backend.Commands.Modules;

public class ModuleMappingProfile : Profile
{
    public ModuleMappingProfile()
    {
        // HTTP > MEDIATR
        CreateMap<ModulePostRequest, ModuleInsertCommand>();
        CreateMap<ModuleDetailRequest, ModuleDetailQuery>();
        CreateMap<ModuleDeleteRequest, ModuleDeleteCommand>();
        CreateMap<ModuleEditRequest, ModuleEditCommand>();
        
        // MEDIATR > HTTP
        CreateMap<ModuleInsertCommandModel, ModulePostResponse>();
        CreateMap<ModuleDetailQueryModel, ModuleDetailResponse>();
        CreateMap<ModuleDeleteCommandModel, ModuleDeleteResponse>();
        CreateMap<ModuleEditCommandModel, ModuleEditResponse>();
        
        // CFG
    } 
}