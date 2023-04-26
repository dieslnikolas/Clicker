using Clicker.Backend.Common.Commands;
using Clicker.Backend.Models;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptRunQueryHandler : CommonHandler<ScriptRunQuery, ScriptRunQueryModel>
{
    public ScriptRunQueryHandler(ICommonHandlerContext<ScriptRunQuery> context) : base(context)
    {
    }

    public override async Task<ScriptRunQueryModel> Handle(ScriptRunQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Get Project
        var project = await Context.DbContext.Get<Project>();

        // Get script
        var script = project.Scripts.FirstOrDefault(x => x.Key == request.Key);

        // TODO: Run script

        // Return
        return new ScriptRunQueryModel();
    }
}