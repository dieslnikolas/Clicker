using AutoMapper;
using Clicker.Backend.Endpoints;
using Clicker.Backend.UseCases.Scripts;

namespace Clicker.Backend.UseCases.Project;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        // HTTP > MEDIATR
        CreateMap<ProjectRequest, ProjectInsertCommand>();
        
        // MEDIATR > HTTP
        CreateMap<ProjectInsertCommandModel, ProjectResponse>();
    } 
}