using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Settings;

public class SettingsEditCommandHandler : CommonHandler<SettingsEditCommand, SettingsEditCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public SettingsEditCommandHandler(ICommonHandlerContext<SettingsEditCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<SettingsEditCommandModel> Handle(SettingsEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Create Settings
        // _ctx.Project.Settings.FirstOrDefault(x => x.Key == request.Key).Name = request.Name;

        // Return JWT
        return new SettingsEditCommandModel() { };
    }
}