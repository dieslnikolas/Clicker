using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Settings;

public class SettingsInsertCommandHandler : CommonHandler<SettingsInsertCommand, SettingsInsertCommandModel>
{

    public SettingsInsertCommandHandler(ICommonHandlerContext<SettingsInsertCommand> context) : base(context)
    {
    }

    public override async Task<SettingsInsertCommandModel> Handle(SettingsInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Get project
        var project = await Context.DbContext.Get<Project>();
            
        // Create Settings
        project.Settings[request.Key] = request.Value;

        // Save changes 
        await Context.DbContext.SaveChanges(project);
        
        // Return JWT
        return new SettingsInsertCommandModel() { };
    }

   
}