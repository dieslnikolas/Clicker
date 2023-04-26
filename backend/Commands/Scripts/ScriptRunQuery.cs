using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptRunQuery : IRequest<ScriptRunQueryModel>, IQuery
{
    public string Key { get; set; }
}

public class ScriptRunQueryModel
{
}
