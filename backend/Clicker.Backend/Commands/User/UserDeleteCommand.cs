using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.User;

public class UserDeleteCommand : IRequest<UserDeleteCommandModel>, ICommand
{
}

public class UserDeleteCommandModel
{
}
