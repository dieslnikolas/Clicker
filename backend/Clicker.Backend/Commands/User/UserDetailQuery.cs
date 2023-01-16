using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.User;

public class UserDetailQuery : IRequest<UserDetailQueryModel>, IQuery
{
}

public class UserDetailQueryModel
{
    public bool IsFirstTimeUser { get; set; }
    public string LastProject { get; set; }
}
