using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Projects;

public class ProjectEditCommandHandler : CommonHandler<ProjectEditCommand, ProjectEditCommandModel>
{

    public ProjectEditCommandHandler(ICommonHandlerContext<ProjectEditCommand> context) : base(context)
    {
    }

    public override async Task<ProjectEditCommandModel> Handle(ProjectEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Get project
        var project = await Context.DbContext.Get<Project>();
        
        // Edit project
        project.Id = request.Id;
        project.Author = request.Author;
        project.Version = request.Version;

        // Save changes
        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new ProjectEditCommandModel() { };
    }
}