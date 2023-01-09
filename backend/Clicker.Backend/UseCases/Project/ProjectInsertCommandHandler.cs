using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Clicker.Backend.Common;
using Clicker.Backend.Common.Authorization;
using Clicker.Backend.Common.UseCases;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.UseCases.Project;

public class ProjectInsertCommandHandler : CommonHandler<ProjectInsertCommand, ProjectInsertCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ProjectInsertCommandHandler(ICommonHandlerContext<ProjectInsertCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ProjectInsertCommandModel> Handle(ProjectInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Null check - if there is no author, we use logged user
        request.Author ??= Environment.UserName;
        
        // Get JWT
        var jwtToken = Jwt.GetToken(request.Path, request.Id, request.Author, request.Key, _cfg);
        
        // Setup "DB" context
        await _ctx.SetConnectionString(request.Path);
        
        // Create project
        _ctx.Project.Id = request.Id;
        _ctx.Project.Author = request.Author;

        // Return JWT
        return new ProjectInsertCommandModel() { JWT = jwtToken };
    }

   
}