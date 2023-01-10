using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Settings;

public class SettingsEditCommand : IRequest<SettingsEditCommandModel>, ICommand
{
    public string Key { get; set; }
    public string Name { get; set; }
}

public class SettingsEditCommandModel
{
}
