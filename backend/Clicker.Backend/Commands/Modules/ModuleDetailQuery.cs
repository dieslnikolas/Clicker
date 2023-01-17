using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;
using MediatR;

namespace Clicker.Backend.Commands.Modules;

public class ModuleDetailQuery : IRequest<ModuleDetailQueryModel>, IQuery
{
    public string Key { get; set; }
}

public class ModuleDetailQueryModel
{
    public string Name { get; set; }
    public string Key { get; set; }
    public IEnumerable<Script> Scripts { get; set; }
    public IEnumerable<Dictionary<string, object>> Data { get; set; }
}
