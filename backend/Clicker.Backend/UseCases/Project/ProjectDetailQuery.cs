using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Project;

public class ProjectDetailQuery : IRequest<ProjectDetailQueryModel>, IQuery
{
}

public class ProjectDetailQueryModel
{
    public string Id { get; set; }
    public string Author { get; set; }
    public string Version { get; set; }

}
