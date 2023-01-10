using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.User;

public class UserInsertCommandHandler : CommonHandler<UserInsertCommand, UserInsertCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public UserInsertCommandHandler(ICommonHandlerContext<UserInsertCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<UserInsertCommandModel> Handle(UserInsertCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Create User
        // _ctx.Project.User.Add(null);

        // Return JWT
        return new UserInsertCommandModel() { };
    }

   
}