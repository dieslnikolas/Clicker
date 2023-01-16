using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Projects;

public class ProjectDetailQueryHandler : CommonHandler<ProjectDetailQuery, ProjectDetailQueryModel>
{
    public ProjectDetailQueryHandler(ICommonHandlerContext<ProjectDetailQuery> context) : base(context)
    {
    }

    public override async Task<ProjectDetailQueryModel> Handle(ProjectDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var project = await Context.DbContext.Get<Project>();
        
        var result = new ProjectDetailQueryModel()
        {
            Author = project.Author,
            Id = project.Id,
            Version = project.Version,
            Scripts = project.Scripts
        };
        
        // Return
        return result;
    }

}