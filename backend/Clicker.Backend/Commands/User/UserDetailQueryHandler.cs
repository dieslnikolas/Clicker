using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.User;

public class UserDetailQueryHandler : CommonHandler<UserDetailQuery, UserDetailQueryModel>
{
    public UserDetailQueryHandler(ICommonHandlerContext<UserDetailQuery> context) : base(context)
    {
    }

    public override async Task<UserDetailQueryModel> Handle(UserDetailQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Get user
        var user = await Context.DbContext.Get<Backend.Settings.User>();

        // map 
        var result = new UserDetailQueryModel()
        {
            IsFirstTimeUser = user.IsFirstTimeUser,
            LastProject = user.LastProject
        };

        // Return
        return result;
    }
}