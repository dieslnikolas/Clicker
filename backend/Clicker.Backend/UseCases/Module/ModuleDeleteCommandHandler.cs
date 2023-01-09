using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Clicker.Backend.Common;
using Clicker.Backend.Common.UseCases;
using Clicker.Backend.Settings;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.UseCases.Module;

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