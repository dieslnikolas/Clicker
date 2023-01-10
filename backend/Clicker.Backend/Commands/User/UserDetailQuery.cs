using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.User;

public class UserDetailQuery : IRequest<UserDetailQueryModel>, IQuery
{
    public string Key { get; set; }
}

public class UserDetailQueryModel
{
    public string Name { get; set; }
    public string Key { get; set; }
}
