using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.Modules;

public class ModuleInsertCommandHandler : CommonHandler<ModuleInsertCommand, ModuleInsertCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public ModuleInsertCommandHandler(ICommonHandlerContext<ModuleInsertCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<ModuleInsertCommandModel> Handle(ModuleInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Create Module
        _ctx.Project.Modules.Add(null);

        // Return JWT
        return new ModuleInsertCommandModel() { };
    }

   
}