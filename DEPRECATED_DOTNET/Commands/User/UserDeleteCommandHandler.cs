using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Databases;

namespace Clicker.Backend.Commands.User;

public class UserDeleteCommandHandler : CommonHandler<UserDeleteCommand, UserDeleteCommandModel>
{
    public UserDeleteCommandHandler(ICommonHandlerContext<UserDeleteCommand> context) : base(context)
    {
    }

    public override async Task<UserDeleteCommandModel> Handle(UserDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        // Get User settings settings
        var user = Context.DbContext.Get<Models.User>();

        // Delete user file
        File.Delete(await Context.DbContext.GetUserJsonFilePath());
        
        // Return JWT
        return new UserDeleteCommandModel() { };
    }
}