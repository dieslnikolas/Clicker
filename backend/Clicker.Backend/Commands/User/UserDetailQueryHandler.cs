using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.User;

public class UserDetailQueryHandler : CommonHandler<UserDetailQuery, UserDetailQueryModel>
{
    private readonly IDbContext _ctx;
    private readonly IConfiguration _cfg;

    public UserDetailQueryHandler(ICommonHandlerContext<UserDetailQuery> context, IDbContext ctx, IConfiguration cfg) : base(context)
    {
        _ctx = ctx;
        _cfg = cfg;
    }

    public override async Task<UserDetailQueryModel> Handle(UserDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // var User = _ctx.Project.User;

        var result = new UserDetailQueryModel()
        {
        };
        
        // Return
        return result;
    }

}