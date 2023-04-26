using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptEditCommandHandler : CommonHandler<ScriptEditCommand, ScriptEditCommandModel>
{

    public ScriptEditCommandHandler(ICommonHandlerContext<ScriptEditCommand> context) : base(context)
    {
    }

    public override async Task<ScriptEditCommandModel> Handle(ScriptEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Project
        var project = await Context.DbContext.Get<Project>();

        // Edit script
        var script = project.Scripts.FirstOrDefault(x => x.Key == request.Key);
        if (script != null)
            script.Name = request.Name;
        
        // SaveChanges
        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new ScriptEditCommandModel() { };
    }
}