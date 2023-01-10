using System.ComponentModel;

namespace Clicker.Backend.Settings;

/// <summary>
/// Module
/// </summary>
/// <param name="Name">Name how person would call it</param>
/// <param name="Key">Key how system would describe it</param>
/// <param name="Scripts">list of module scripts</param>
/// <param name="Data">Data - basically JSON array</param>
public interface IModule
{
    string Name { get; set; }
    string Key { get; set; }
    IList<IScript> Scripts { get; }
    IList<Dictionary<string, object>> Data { get; set; }
}