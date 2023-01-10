using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Projects;

public class ProjectDeleteCommand : IRequest<ProjectDeleteCommandModel>, ICommand
{

}

public class ProjectDeleteCommandModel
{
}
