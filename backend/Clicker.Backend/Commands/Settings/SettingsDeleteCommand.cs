using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Settings;

public class SettingsDeleteCommand : IRequest<SettingsDeleteCommandModel>, ICommand
{
     public string Key { get; set; }
}

public class SettingsDeleteCommandModel
{
}
