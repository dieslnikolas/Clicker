using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;

namespace Clicker.Backend.Commands.Modules;

public class ModuleEditCommandHandler : CommonHandler<ModuleEditCommand, ModuleEditCommandModel>
{

    public ModuleEditCommandHandler(ICommonHandlerContext<ModuleEditCommand> context) : base(context)
    {
    }

    public override async Task<ModuleEditCommandModel> Handle(ModuleEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Get Project
        var project = await Context.DbContext.Get<Project>();
        
        // Edit Module
        var module = project.Modules.FirstOrDefault(x => x.Key == request.Key);
        if (module != null)
            module.Name = request.Name;

        // SaveChanges
        await Context.DbContext.SaveChanges(project);
        
        // Return JWT
        return new ModuleEditCommandModel() { };
    }
}