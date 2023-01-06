using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptInsertCommand : IRequest<ScriptInsertCommandModel>, ICommand
{
    public string Command { get; set; }
}

public class ScriptInsertCommandModel
{
}
