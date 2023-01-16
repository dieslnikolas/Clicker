using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;
using Clicker.Backend.Settings;

namespace Clicker.Backend.Commands.User;

public class UserEditCommandHandler : CommonHandler<UserEditCommand, UserEditCommandModel>
{

    public UserEditCommandHandler(ICommonHandlerContext<UserEditCommand> context) : base(context)
    {
    }

    public override async Task<UserEditCommandModel> Handle(UserEditCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));
        
        // Create User
        var user = await Context.DbContext.Get<Backend.Settings.User>();
            
        // edit
        user.IsFirstTimeUser = request.IsFirstTimeUser;
        user.LastProject = request.LastProject;

        // Return JWT
        return new UserEditCommandModel() { };
    }
}