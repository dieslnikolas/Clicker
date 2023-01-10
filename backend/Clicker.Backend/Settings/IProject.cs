using System.ComponentModel;

namespace Clicker.Backend.Settings;

// <summary>
/// Represents root JSON object in configuration
/// </summary>
/// <param name="Id">Project ID</param>
/// <param name="Author">Author</param>
/// <param name="Version">Version</param>
/// <param name="Settings">Settings KEY:VALUE dictionary</param>
/// <param name="DataFolder">Paths to temp etc.</param>
/// <param name="Scripts">Global scripts</param>
/// <param name="Modules">Modules</param>
public interface IProject
{
    [DefaultValue("MyProject")] string Id { get; set; }

    [DefaultValue("Author Name")] string Author { get; set; }

    [DefaultValue("1.0")] string Version { get; set; }

    [DefaultValue(".clicker")] string DataFolder { get; set; }

    /// <summary>
    /// Custom settings
    /// </summary>
    Dictionary<string, object> Settings { get; set; }

    /// <summary>
    /// Global scripts
    /// </summary>
    IList<IScript> Scripts { get; }

    /// <summary>
    /// Modules
    /// </summary>
    IList<IModule> Modules { get; }
    
}