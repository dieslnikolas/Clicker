using Clicker.Backend.Common.Commands;

namespace Clicker.Backend.Commands.Projects;

public class ProjectDeleteCommandHandler : CommonHandler<ProjectDeleteCommand, ProjectDeleteCommandModel>
{

    public ProjectDeleteCommandHandler(ICommonHandlerContext<ProjectDeleteCommand> context) : base(context)
    {
    }

    public override async Task<ProjectDeleteCommandModel> Handle(ProjectDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Delete file
        File.Delete(await Context.DbContext.GetProjectJsonFilePath());

        // Return JWT
        return new ProjectDeleteCommandModel() { };
    }
    
}