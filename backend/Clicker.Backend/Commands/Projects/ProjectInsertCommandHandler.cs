using Clicker.Backend.Common.Authorizations;
using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Projects;

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
        var jwtToken = JwtProvider.GetToken(request.Path, request.Id, request.Author, request.Key, _cfg);
        
        // Setup "DB" context
        _ctx.SetConnectionString(request.Path);
        
        // Create project
        _ctx.Project.Id = request.Id;
        _ctx.Project.Author = request.Author;

        // Return JWT
        return new ProjectInsertCommandModel() { JWT = jwtToken };
    }

   
}