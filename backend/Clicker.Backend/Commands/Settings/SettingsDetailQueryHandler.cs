using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Settings;

public class SettingsDetailQueryHandler : CommonHandler<SettingsDetailQuery, SettingsDetailQueryModel>
{
    public SettingsDetailQueryHandler(ICommonHandlerContext<SettingsDetailQuery> context) : base(context)
    {
    }

    public override async Task<SettingsDetailQueryModel> Handle(SettingsDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // get project
        var project = await Context.DbContext.Get<Project>();

        // Find module
        var result = new SettingsDetailQueryModel()
        {
            Value = request.Key,
            Name = project.Settings[request.Key].ToString()!
        };

        // Return
        return result;
    }
}