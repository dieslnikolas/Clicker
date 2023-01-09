using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Module;

public class ModuleDeleteCommand : IRequest<ModuleDeleteCommandModel>, ICommand
{
     public string Key { get; set; }
}

public class ModuleDeleteCommandModel
{
}
