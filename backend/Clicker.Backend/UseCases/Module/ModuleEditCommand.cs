using Clicker.Backend.Common.UseCases;
using Clicker.Backend.Settings;
using MediatR;

namespace Clicker.Backend.UseCases.Module;

public class ModuleEditCommand : IRequest<ModuleEditCommandModel>, ICommand
{
    public string Key { get; set; }
    public string Name { get; set; }
}

public class ModuleEditCommandModel
{
}
