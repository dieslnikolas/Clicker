using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Settings;

public class SettingsEditCommandHandler : CommonHandler<SettingsEditCommand, SettingsEditCommandModel>
{

    public SettingsEditCommandHandler(ICommonHandlerContext<SettingsEditCommand> context) : base(context)
    {
    }

    public override async Task<SettingsEditCommandModel> Handle(SettingsEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Get project
        var project = await Context.DbContext.Get<Project>();
            
        // Edit Settings
        if (project.Settings.ContainsKey(request.Key))
            project.Settings[request.Key] = request.Value;
        
        // Save changes
        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new SettingsEditCommandModel() { };
    }
}