using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Projects;

public class ProjectEditCommand : IRequest<ProjectEditCommandModel>, ICommand
{
    /// <summary>
    /// ID is basicaly project name
    /// </summary>
    public string Id { get; set; }
    
    /// <summary>
    /// Author is not required
    /// </summary>
    public string Author { get; set; }
    
    /// <summary>
    /// Api key, private
    /// </summary>
    public string Version { get; set; }
}

public class ProjectEditCommandModel
{
}
