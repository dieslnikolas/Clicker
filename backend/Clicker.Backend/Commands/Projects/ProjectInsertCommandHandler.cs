using Clicker.Backend.Common.Authorizations;
using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Projects;

public class ProjectInsertCommandHandler : CommonHandler<ProjectInsertCommand, ProjectInsertCommandModel>
{
    private readonly IConfiguration _cfg;

    public ProjectInsertCommandHandler(ICommonHandlerContext<ProjectInsertCommand> context, IConfiguration cfg) : base(context)
    {
        _cfg = cfg;
    }

    public override async Task<ProjectInsertCommandModel> Handle(ProjectInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Null check - if there is no author, we use logged user
        request.Author ??= Environment.UserName;
        
        // Get JWT
        var jwtToken = JwtProvider.GetToken(request.Path!, request.Id, request.Author, request.Key, _cfg);
        
        // Setup "DB" context
        await Context.DbContext.SetProjectJsonFilePath(request.Path);
        
        // Create project
        var project = new Project
        {
            Id = request.Id,
            Author = request.Author
        };

        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new ProjectInsertCommandModel() { JWT = jwtToken };
    }

   
}