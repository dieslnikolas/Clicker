using AutoMapper;
using Clicker.Backend.Endpoints;

namespace Clicker.Backend.Commands.Projects;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        // HTTP > MEDIATR
        CreateMap<ProjectPostRequest, ProjectInsertCommand>();
        CreateMap<ProjectDetailRequest, ProjectDetailQuery>();
        CreateMap<ProjectOpenRequest, ProjectOpenQuery>();
        CreateMap<ProjectDeleteRequest, ProjectDeleteCommand>();
        CreateMap<ProjectEditRequest, ProjectEditCommand>();
        
        // MEDIATR > HTTP
        CreateMap<ProjectInsertCommandModel, ProjectPostResponse>();
        CreateMap<ProjectDetailQueryModel, ProjectDetailResponse>();
        CreateMap<ProjectOpenQueryModel, ProjectOpenResponse>();
        CreateMap<ProjectDeleteCommandModel, ProjectDeleteResponse>();
        CreateMap<ProjectEditCommandModel, ProjectEditResponse>();
    } 
}