using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.User;

public class UserDeleteCommand : IRequest<UserDeleteCommandModel>, ICommand
{
     public string Key { get; set; }
}

public class UserDeleteCommandModel
{
}
