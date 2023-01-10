using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptDeleteCommandHandler : CommonHandler<ScriptDeleteCommand, ScriptDeleteCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;
    private readonly IHttpContextAccessor _contextAccessor;

    public ScriptDeleteCommandHandler(ICommonHandlerContext<ScriptDeleteCommand> context, IDbContext ctx, IConfiguration cfg, IHttpContextAccessor contextAccessor) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ScriptDeleteCommandModel> Handle(ScriptDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // var filter = _ctx.Project.Scripts.FirstOrDefault(x => x.Key == request.Key);
        // _ctx.Project.Scripts.Remove(filter);

        // Return JWT
        return new ScriptDeleteCommandModel() { };
    }
    
}