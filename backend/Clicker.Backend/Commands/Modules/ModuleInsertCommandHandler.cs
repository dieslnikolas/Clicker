using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;

namespace Clicker.Backend.Commands.Modules;

public class ModuleInsertCommandHandler : CommonHandler<ModuleInsertCommand, ModuleInsertCommandModel>
{
    public ModuleInsertCommandHandler(ICommonHandlerContext<ModuleInsertCommand> context) : base(context)
    {
    }

    public override async Task<ModuleInsertCommandModel> Handle(ModuleInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var project = await Context.DbContext.Get<Project>();
        
        // Create Module
        project.Modules.Add(new Module()
        {
            Key = request.Key,
            Name = request.Name
        });

        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new ModuleInsertCommandModel() { };
    }

   
}