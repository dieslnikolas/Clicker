using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptRunQueryHandler : CommonHandler<ScriptRunQuery, ScriptRunQueryModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ScriptRunQueryHandler(ICommonHandlerContext<ScriptRunQuery> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ScriptRunQueryModel> Handle(ScriptRunQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // var Script = _ctx.Project.Scripts.FirstOrDefault(x => x.Key == request.Key);

        var result = new ScriptRunQueryModel()
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