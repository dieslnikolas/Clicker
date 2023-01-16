using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;
using MediatR;

namespace Clicker.Backend.Commands.Projects;

public class ProjectDetailQuery : IRequest<ProjectDetailQueryModel>, IQuery
{
}

public class ProjectDetailQueryModel
{
    public string Id { get; set; }
    public string Author { get; set; }
    public string Version { get; set; }
    public IEnumerable<Script> Scripts { get; set; }
}