using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Modules;

public class ModuleEditCommandHandler : CommonHandler<ModuleEditCommand, ModuleEditCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ModuleEditCommandHandler(ICommonHandlerContext<ModuleEditCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ModuleEditCommandModel> Handle(ModuleEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Create Module
        _ctx.Project.Modules.FirstOrDefault(x => x.Key == request.Key).Name = request.Name;

        // Return JWT
        return new ModuleEditCommandModel() { };
    }
}