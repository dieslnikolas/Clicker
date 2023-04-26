using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Modules;

public class ModuleEditCommand : IRequest<ModuleEditCommandModel>, ICommand
{
    public string Key { get; set; }
    public string Name { get; set; }
}

public class ModuleEditCommandModel
{
}
