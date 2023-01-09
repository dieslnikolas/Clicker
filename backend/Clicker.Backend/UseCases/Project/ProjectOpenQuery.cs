using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Project;

public class ProjectOpenQuery : IRequest<ProjectOpenQueryModel>, IQuery
{
    public string Path { get; set; }
    public string Key { get; set; }
}

public class ProjectOpenQueryModel
{
    public string Jwt { get; set; }
}
