using AutoMapper;
using Clicker.Backend.Endpoints;
using Clicker.Backend.Settings;
using Clicker.Backend.UseCases.Scripts;

namespace Clicker.Backend.UseCases.Module;

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