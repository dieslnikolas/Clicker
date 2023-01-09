using Clicker.Backend.Common;
using Clicker.Backend.Common.UseCases;

namespace Clicker.Backend.UseCases.Project;

public class ProjectDetailQueryHandler : CommonHandler<ProjectDetailQuery, ProjectDetailQueryModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ProjectDetailQueryHandler(ICommonHandlerContext<ProjectDetailQuery> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ProjectDetailQueryModel> Handle(ProjectDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var result = new ProjectDetailQueryModel()
        {
            Author = _ctx.Project.Author,
            Id = _ctx.Project.Id,
            Version = _ctx.Project.Version
        };
        
        // Return
        return result;
    }

}