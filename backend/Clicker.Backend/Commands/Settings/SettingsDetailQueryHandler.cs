using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Settings;

public class SettingsDetailQueryHandler : CommonHandler<SettingsDetailQuery, SettingsDetailQueryModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public SettingsDetailQueryHandler(ICommonHandlerContext<SettingsDetailQuery> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<SettingsDetailQueryModel> Handle(SettingsDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var Settings = _ctx.Project.Settings;

        var result = new SettingsDetailQueryModel()
        {
        };
        
        // Return
        return result;
    }

}