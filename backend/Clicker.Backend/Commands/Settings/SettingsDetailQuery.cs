using Clicker.Backend.Common.Commands;
using MediatR;

namespace Clicker.Backend.Commands.Settings;

public class SettingsDetailQuery : IRequest<SettingsDetailQueryModel>, IQuery
{
    public string Key { get; set; }
}

public class SettingsDetailQueryModel
{
    public string Name { get; set; }
    public string Key { get; set; }
}
