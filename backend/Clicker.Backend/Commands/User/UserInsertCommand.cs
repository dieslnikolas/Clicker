using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.User;

public class UserInsertCommand : IRequest<UserInsertCommandModel>, ICommand
{
    /// <summary>
    /// Path to file
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Api key, private
    /// </summary>
    public string Key { get; set; }
}

public class UserInsertCommandModel
{
}
