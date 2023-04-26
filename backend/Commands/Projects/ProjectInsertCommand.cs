using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Projects;

public class ProjectInsertCommand : IRequest<ProjectInsertCommandModel>, ICommand
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
    /// Path to file
    /// </summary>
    public string? Path { get; set; }

    /// <summary>
    /// Api key, private
    /// </summary>
    public string Key { get; set; }
}

public class ProjectInsertCommandModel
{
    /// <summary>
    /// JWT
    /// </summary>
    public string JWT { get; set; }
}
