using Clicker.Backend.Common.Authorizations;
using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Projects;

public class ProjectOpenQueryHandler : CommonHandler<ProjectOpenQuery, ProjectOpenQueryModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ProjectOpenQueryHandler(ICommonHandlerContext<ProjectOpenQuery> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ProjectOpenQueryModel> Handle(ProjectOpenQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Setup "DB" context
        _ctx.SetConnectionString(request.Path);
        
        // Get JWT
        var jwtToken = JwtProvider.GetToken(request.Path, _ctx.Project.Id, _ctx.Project.Author, request.Key, _cfg);

        // Return JWT
        return new ProjectOpenQueryModel() { Jwt = jwtToken };
    }

}