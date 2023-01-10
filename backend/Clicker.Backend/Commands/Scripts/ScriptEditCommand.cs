using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptEditCommand : IRequest<ScriptEditCommandModel>, ICommand
{
    public string Key { get; set; }
    public string Name { get; set; }
}

public class ScriptEditCommandModel
{
}
