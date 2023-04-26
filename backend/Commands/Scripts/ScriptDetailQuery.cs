using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptDetailQuery : IRequest<ScriptDetailQueryModel>, IQuery
{
    public string Key { get; set; }
}

public class ScriptDetailQueryModel
{
    public string Name { get; set; }
    public string Key { get; set; }
    public bool IsContext { get; set; }
    public bool IsDefault { get; set; }
    public bool IsImport { get; set; }
}
