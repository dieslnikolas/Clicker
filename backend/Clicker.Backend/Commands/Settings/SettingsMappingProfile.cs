using AutoMapper;
using Clicker.Backend.Endpoints;

namespace Clicker.Backend.Commands.Settings;

public class SettingsMappingProfile : Profile
{
    public SettingsMappingProfile()
    {
        // HTTP > MEDIATR
        CreateMap<SettingsPostRequest, SettingsInsertCommand>();
        CreateMap<SettingsDetailRequest, SettingsDetailQuery>();
        CreateMap<SettingsDeleteRequest, SettingsDeleteCommand>();
        CreateMap<SettingsEditRequest, SettingsEditCommand>();
        
        // MEDIATR > HTTP
        CreateMap<SettingsInsertCommandModel, SettingsPostResponse>();
        CreateMap<SettingsDetailQueryModel, SettingsDetailResponse>();
        CreateMap<SettingsDeleteCommandModel, SettingsDeleteResponse>();
        CreateMap<SettingsEditCommandModel, SettingsEditResponse>();
    } 
}