using Clicker.Backend.Common.UseCases;
using MediatR;

namespace Clicker.Backend.UseCases.Module;

public class ModuleInsertCommand : IRequest<ModuleInsertCommandModel>, ICommand
{
    /// <summary>
    /// Path to file
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Api key, private
    /// </summary>
    public string Key { get; set; }
}

public class ModuleInsertCommandModel
{
}
