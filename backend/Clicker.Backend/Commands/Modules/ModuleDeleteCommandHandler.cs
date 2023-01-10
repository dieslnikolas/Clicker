using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Modules;

public class ModuleDeleteCommandHandler : CommonHandler<ModuleDeleteCommand, ModuleDeleteCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;
    private readonly IHttpContextAccessor _contextAccessor;

    public ModuleDeleteCommandHandler(ICommonHandlerContext<ModuleDeleteCommand> context, IDbContext ctx, IConfiguration cfg, IHttpContextAccessor contextAccessor) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ModuleDeleteCommandModel> Handle(ModuleDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var filter = _ctx.Project.Modules.FirstOrDefault(x => x.Key == request.Key);
        _ctx.Project.Modules.Remove(filter);

        // Return JWT
        return new ModuleDeleteCommandModel() { };
    }
    
}