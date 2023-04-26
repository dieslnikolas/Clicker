using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Modules;

public class ModuleDeleteCommand : IRequest<ModuleDeleteCommandModel>, ICommand
{
     public string Key { get; set; }
}

public class ModuleDeleteCommandModel
{
}
