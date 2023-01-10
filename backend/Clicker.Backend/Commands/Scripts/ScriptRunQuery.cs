using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;
using MediatR;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptRunQuery : IRequest<ScriptRunQueryModel>, IQuery
{
    public string Key { get; set; }
}

public class ScriptRunQueryModel
{
    public string Name { get; set; }
    public string Key { get; set; }
    public IEnumerable<IScript> Scripts { get; set; }
    public IEnumerable<Dictionary<string, object>> Data { get; set; }
}
