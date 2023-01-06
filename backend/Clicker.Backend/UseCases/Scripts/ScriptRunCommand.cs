using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptRunCommand : IRequest<ScriptRunCommandModel>, ICommand
{
    public string Command { get; set; }
}

public class ScriptRunCommandModel
{
}
