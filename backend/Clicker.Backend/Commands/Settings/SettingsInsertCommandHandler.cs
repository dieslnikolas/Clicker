using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Settings;

public class SettingsInsertCommandHandler : CommonHandler<SettingsInsertCommand, SettingsInsertCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public SettingsInsertCommandHandler(ICommonHandlerContext<SettingsInsertCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<SettingsInsertCommandModel> Handle(SettingsInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Create Settings
        // _ctx.Project.Settings.Add(null);

        // Return JWT
        return new SettingsInsertCommandModel() { };
    }

   
}