using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Scripts;

public class ScriptDetailQueryHandler : CommonHandler<ScriptDetailQuery, ScriptDetailQueryModel>
{

    public ScriptDetailQueryHandler(ICommonHandlerContext<ScriptDetailQuery> context) : base(context)
    {
    }

    public override async Task<ScriptDetailQueryModel> Handle(ScriptDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var project = await Context.DbContext.Get<Project>();
        var script = project.Scripts.FirstOrDefault(x => x.Key == request.Key);

        var result = new ScriptDetailQueryModel()
        {
            Key = script!.Key,
            Name = script.Name,
            IsContext = script.IsContext,
            IsDefault = script.IsDefault,
            IsImport = script.IsImport
        };
        
        // Return
        return result;
    }

}