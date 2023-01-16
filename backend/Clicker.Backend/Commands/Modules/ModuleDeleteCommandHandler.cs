using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Modules;

public class ModuleDeleteCommandHandler : CommonHandler<ModuleDeleteCommand, ModuleDeleteCommandModel>
{

    public ModuleDeleteCommandHandler(ICommonHandlerContext<ModuleDeleteCommand> context) : base(context)
    {
    }

    public override async Task<ModuleDeleteCommandModel> Handle(ModuleDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Get project
        var project = await Context.DbContext.Get<Project>();

        // Find moudle and remove
        var filter = project.Modules.FirstOrDefault(x => x.Key == request.Key);
        if (filter != null) project.Modules.Remove(filter);

        // Save changes
        await Context.DbContext.SaveChanges(project);
        
        // Return JWT
        return new ModuleDeleteCommandModel() { };
    }
    
}