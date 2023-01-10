using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.User;

public class UserDeleteCommandHandler : CommonHandler<UserDeleteCommand, UserDeleteCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;
    private readonly IHttpContextAccessor _contextAccessor;

    public UserDeleteCommandHandler(ICommonHandlerContext<UserDeleteCommand> context, IDbContext ctx, IConfiguration cfg, IHttpContextAccessor contextAccessor) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<UserDeleteCommandModel> Handle(UserDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // var filter = _ctx.Project.User;
        // _ctx.Project.Users.Remove(filter);

        // Return JWT
        return new UserDeleteCommandModel() { };
    }
    
}