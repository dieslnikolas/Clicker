using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Projects;

public class ProjectOpenQuery : IRequest<ProjectOpenQueryModel>, IQuery
{
    public string Path { get; set; }
    public string Key { get; set; }
}

public class ProjectOpenQueryModel
{
    public string Jwt { get; set; }
}
