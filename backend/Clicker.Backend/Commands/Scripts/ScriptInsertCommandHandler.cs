using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptInsertCommandHandler : CommonHandler<ScriptInsertCommand, ScriptInsertCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ScriptInsertCommandHandler(ICommonHandlerContext<ScriptInsertCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ScriptInsertCommandModel> Handle(ScriptInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Create Script
        _ctx.Project.Scripts.Add(null);

        // Return JWT
        return new ScriptInsertCommandModel() { };
    }

   
}