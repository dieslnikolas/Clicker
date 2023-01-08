using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptGetQuery : IRequest<ScriptGetQueryModel>, IQuery
{
    public string Command { get; set; }
}

public class ScriptGetQueryModel
{
}
