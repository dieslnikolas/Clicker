using Clicker.Backend.Common;
using Clicker.Backend.Common.UseCases;

namespace Clicker.Backend.UseCases.Module;

public class ModuleDetailQueryHandler : CommonHandler<ModuleDetailQuery, ModuleDetailQueryModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ModuleDetailQueryHandler(ICommonHandlerContext<ModuleDetailQuery> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ModuleDetailQueryModel> Handle(ModuleDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var module = _ctx.Project.Modules.FirstOrDefault(x => x.Key == request.Key);

        var result = new ModuleDetailQueryModel()
        {
            Key = module.Key,
            Name = module.Name,
            Data = module.Data,
            Scripts = module.Scripts
        };
        
        // Return
        return result;
    }

}