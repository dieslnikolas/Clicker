using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptInsertCommandHandler : CommonHandler<ScriptInsertCommand, ScriptInsertCommandModel>
{

    public ScriptInsertCommandHandler(ICommonHandlerContext<ScriptInsertCommand> context) : base(context)
    {
    }

    public override async Task<ScriptInsertCommandModel> Handle(ScriptInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Create Script
        var project = await Context.DbContext.Get<Project>();

        project.Scripts.Add(new Script()
        {
            Name = request.Name,
            Key = request.Key
        });

        // save changes
        await Context.DbContext.SaveChanges(project);

        // Return JWT
        return new ScriptInsertCommandModel() { };
    }
}