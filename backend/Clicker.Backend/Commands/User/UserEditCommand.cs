using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.User;

public class UserEditCommand : IRequest<UserEditCommandModel>, ICommand
{
    public string Key { get; set; }
    public string Name { get; set; }
}

public class UserEditCommandModel
{
}
