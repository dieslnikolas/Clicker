using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Clicker.Backend.Common;
using Clicker.Backend.Common.UseCases;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.UseCases.Project;

public class ProjectEditCommandHandler : CommonHandler<ProjectEditCommand, ProjectEditCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ProjectEditCommandHandler(ICommonHandlerContext<ProjectEditCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ProjectEditCommandModel> Handle(ProjectEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Create project
        _ctx.Project.Id = request.Id;
        _ctx.Project.Author = request.Author;
        _ctx.Project.Version = request.Version;

        // Return JWT
        return new ProjectEditCommandModel() { };
    }
}