using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Settings;

public class SettingsInsertCommand : IRequest<SettingsInsertCommandModel>, ICommand
{
    /// <summary>
    /// Path to file
    /// </summary>
    public string Value { get; set; }

    /// <summary>
    /// Api key, private
    /// </summary>
    public string Key { get; set; }
}

public class SettingsInsertCommandModel
{
}
