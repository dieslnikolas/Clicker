using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Clicker.Backend.Common;
using Clicker.Backend.Common.Authorization;
using Clicker.Backend.Common.UseCases;
using Clicker.Backend.Settings;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.UseCases.Module;

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
        _ctx.Project.Modules.Add(new Settings.Module()
        {
            Data = new List<Dictionary<string, object>>(),
            Key = request.Key,
            Name = request.Name 
        });

        // Return JWT
        return new ModuleInsertCommandModel() { };
    }

   
}