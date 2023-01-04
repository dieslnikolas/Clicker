using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptGetQuery : IRequest<ScriptGetModel>, IQuery
{
    public string Command { get; set; }
}

public class ScriptGetModel
{
}
