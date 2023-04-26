using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.User;

public class UserEditCommand : IRequest<UserEditCommandModel>, ICommand
{
    public string LastProject { get; set; }
    public bool IsFirstTimeUser { get; set; }
}

public class UserEditCommandModel
{
}