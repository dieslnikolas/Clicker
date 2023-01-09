using Clicker.Backend.Common.UseCases;
using Clicker.Backend.Settings;
using MediatR;

namespace Clicker.Backend.UseCases.Module;

public class ModuleDetailQuery : IRequest<ModuleDetailQueryModel>, IQuery
{
    public string Key { get; set; }
}

public class ModuleDetailQueryModel
{
    public string Name { get; set; }
    public string Key { get; set; }
    public IEnumerable<IScripts> Scripts { get; set; }
    public IEnumerable<Dictionary<string, object>> Data { get; set; }
}
