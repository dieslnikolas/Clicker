using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptEditCommandHandler : CommonHandler<ScriptEditCommand, ScriptEditCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ScriptEditCommandHandler(ICommonHandlerContext<ScriptEditCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ScriptEditCommandModel> Handle(ScriptEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Create Script
        // _ctx.Project.Scripts.FirstOrDefault(x => x.Key == request.Key).Name = request.Name;

        // Return JWT
        return new ScriptEditCommandModel() { };
    }
}