using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptDetailQueryHandler : CommonHandler<ScriptDetailQuery, ScriptDetailQueryModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ScriptDetailQueryHandler(ICommonHandlerContext<ScriptDetailQuery> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ScriptDetailQueryModel> Handle(ScriptDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // var Script = _ctx.Project.Scripts.FirstOrDefault(x => x.Key == request.Key);

        var result = new ScriptDetailQueryModel()
        {
            // Key = Script.Key,
            // Name = Script.Name,
            // Data = Script.Data,
            // Scripts = Script.Scripts
        };
        
        // Return
        return result;
    }

}