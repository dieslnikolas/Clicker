using Clicker.Backend.Common;
using Clicker.Backend.Common.UseCases;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptGetQueryHandler: CommonHandler<ScriptGetQuery, ScriptGetQueryModel>
{
    private readonly IDbContext _ctx;

    public ScriptGetQueryHandler(ICommonHandlerContext<ScriptGetQuery> context, IDbContext ctx) : base(context)
    {
        _ctx = ctx;
    }

    public override async Task<ScriptGetQueryModel> Handle(ScriptGetQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // TODO: do it better via authotize, add api key + project settings file path, and project name
        _ctx.SetConnectionString("NONEXISTS");
        
        // Update project ID
        _ctx.Project.Id = "Ahoj";

        return _mapper.Map<ScriptGetQueryModel>(new object());
    }
}
