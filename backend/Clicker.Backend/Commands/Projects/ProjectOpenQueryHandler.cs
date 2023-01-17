using Clicker.Backend.Common.Authorizations;
using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;

namespace Clicker.Backend.Commands.Projects;

public class ProjectOpenQueryHandler : CommonHandler<ProjectOpenQuery, ProjectOpenQueryModel>
{
    private readonly IConfiguration _cfg;

    public ProjectOpenQueryHandler(ICommonHandlerContext<ProjectOpenQuery> context, IConfiguration cfg) : base(context)
    {
        _cfg = cfg;
    }

    public override async Task<ProjectOpenQueryModel> Handle(ProjectOpenQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Setup "DB" context
        await Context.DbContext.SetProjectJsonFilePath(request.Path);

        var project = await this.Context.DbContext.Get<Project>();

        // Get JWT
        var jwtToken = JwtProvider.GetToken(request.Path, project.Id, project.Author, request.Key, _cfg);

        // Return JWT
        return new ProjectOpenQueryModel() { Jwt = jwtToken };
    }
}