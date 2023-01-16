using System.ComponentModel;

namespace Clicker.Backend.Settings;

public class Project
{
    [DefaultValue("MyProject")] public string Id { get; set; }

    [DefaultValue("Author Name")] public string Author { get; set; }

    [DefaultValue("1.0")] public string Version { get; set; }

    [DefaultValue(".clicker")] public string DataFolder { get; set; }

    /// <summary>
    /// Custom settings
    /// </summary>
    public Dictionary<string, object> Settings { get; set; }

    /// <summary>
    /// Global scripts
    /// </summary>
    public IList<Script> Scripts { get; }

    /// <summary>
    /// Modules
    /// </summary>
    public IList<Module> Modules { get; }
    
}