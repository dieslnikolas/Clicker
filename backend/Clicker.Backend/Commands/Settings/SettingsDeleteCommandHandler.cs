using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Settings;

public class SettingsDeleteCommandHandler : CommonHandler<SettingsDeleteCommand, SettingsDeleteCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;
    private readonly IHttpContextAccessor _contextAccessor;

    public SettingsDeleteCommandHandler(ICommonHandlerContext<SettingsDeleteCommand> context, IDbContext ctx, IConfiguration cfg, IHttpContextAccessor contextAccessor) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<SettingsDeleteCommandModel> Handle(SettingsDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var filter = _ctx.Project.Settings;
        // _ctx.Project.Settingss.Remove(filter);

        // Return JWT
        return new SettingsDeleteCommandModel() { };
    }
    
}