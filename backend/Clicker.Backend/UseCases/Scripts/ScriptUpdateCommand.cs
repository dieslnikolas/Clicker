using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptUpdateCommand : IRequest<ScriptUpdateCommandModel>, ICommand
{
    public string Command { get; set; }
}

public class ScriptUpdateCommandModel
{
}
