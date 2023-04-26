using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptInsertCommand : IRequest<ScriptInsertCommandModel>, ICommand
{
    /// <summary>
    /// Path to file
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Api key, private
    /// </summary>
    public string Key { get; set; }
}

public class ScriptInsertCommandModel
{
}
