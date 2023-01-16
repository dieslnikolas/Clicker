using Clicker.Backend.Common.Commands;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.Modules;

public class ModuleDetailQueryHandler : CommonHandler<ModuleDetailQuery, ModuleDetailQueryModel>
{
    public ModuleDetailQueryHandler(ICommonHandlerContext<ModuleDetailQuery> context) : base(context)
    {
    }

    public override async Task<ModuleDetailQueryModel> Handle(ModuleDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Get project
        var project = await Context.DbContext.Get<Project>();
        
        // Get moudule
        var module = project.Modules.FirstOrDefault(x => x.Key == request.Key);

        var result = new ModuleDetailQueryModel()
        {
            Key = module!.Key,
            Name = module.Name,
            Data = module.Data,
            Scripts = module.Scripts
        };
        
        // Return
        return result;
    }

}