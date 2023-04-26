using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptDeleteCommandHandler : CommonHandler<ScriptDeleteCommand, ScriptDeleteCommandModel>
{

    public ScriptDeleteCommandHandler(ICommonHandlerContext<ScriptDeleteCommand> context) : base(context)
    {
    }

    public override async Task<ScriptDeleteCommandModel> Handle(ScriptDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // GetProject
        var project = await Context.DbContext.Get<Project>();
        
        // Find moudle and remove
        var filter = project.Scripts.FirstOrDefault(x => x.Key == request.Key);
        if (filter != null) project.Scripts.Remove(filter);

        // Save changes
        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new ScriptDeleteCommandModel() { };
    }
    
}