namespace Clicker.Backend.Models;

public class Project
{
    public string Id { get; set; }
    public string Author { get; set; } = Environment.UserName;
    public string Version { get; set; } = "1.0";
    public string DataFolder { get; set; } = ".clicker";

    /// <summary>
    /// Custom settings
    /// </summary>
    public Dictionary<string, object> Settings { get; set; } = new Dictionary<string, object>();

    /// <summary>
    /// Global scripts
    /// </summary>
    public IList<Script> Scripts { get; } = new List<Script>();

    /// <summary>
    /// Modules
    /// </summary>
    public IList<Module> Modules { get; } = new List<Module>();

}