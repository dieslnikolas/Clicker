using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptDeleteCommand : IRequest<ScriptDeleteCommandModel>, ICommand
{
     public string Key { get; set; }
}

public class ScriptDeleteCommandModel
{
}
