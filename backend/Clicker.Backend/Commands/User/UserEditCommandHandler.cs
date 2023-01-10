using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.User;

public class UserEditCommandHandler : CommonHandler<UserEditCommand, UserEditCommandModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public UserEditCommandHandler(ICommonHandlerContext<UserEditCommand> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<UserEditCommandModel> Handle(UserEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Create User
        // _ctx.Project.User.FirstOrDefault(x => x.Key == request.Key).Name = request.Name;

        // Return JWT
        return new UserEditCommandModel() { };
    }
}