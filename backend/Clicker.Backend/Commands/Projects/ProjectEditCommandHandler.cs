using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Projects;

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