using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Settings;

public class SettingsDeleteCommandHandler : CommonHandler<SettingsDeleteCommand, SettingsDeleteCommandModel>
{
    public SettingsDeleteCommandHandler(ICommonHandlerContext<SettingsDeleteCommand> context) : base(context)
    {
    }

    public override async Task<SettingsDeleteCommandModel> Handle(SettingsDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Get project
        var project = await Context.DbContext.Get<Project>();
        
        // Find moudle and remove
        var found = project.Settings.ContainsKey(request.Key);
        if (found) 
            project.Settings.Remove(request.Key);

        // Save changes
        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new SettingsDeleteCommandModel() { };
    }
    
}