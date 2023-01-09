using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Clicker.Backend.Common;
using Clicker.Backend.Common.UseCases;
using Clicker.Backend.Settings;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.UseCases.Project;

public class ProjectDeleteCommandHandler : CommonHandler<ProjectDeleteCommand, ProjectDeleteCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;
    private readonly IHttpContextAccessor _contextAccessor;

    public ProjectDeleteCommandHandler(ICommonHandlerContext<ProjectDeleteCommand> context, IDbContext ctx, IConfiguration cfg, IHttpContextAccessor contextAccessor) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
        _contextAccessor = contextAccessor;
    }

    public override async Task<ProjectDeleteCommandModel> Handle(ProjectDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        var cstrinf = _contextAccessor.HttpContext.User.FindFirst("ConnectionString");
        File.Delete(cstrinf.Value);

        // Return JWT
        return new ProjectDeleteCommandModel() { };
    }
    
}