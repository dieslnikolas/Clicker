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

    // /// <summary>
    // /// Custom settings
    // /// </summary>
    // Dictionary<string, object> Settings { get; set; }

    /// <summary>
    /// Global scripts
    /// </summary>
    IEnumerable<IScripts> Scripts { get; }

    /// <summary>
    /// Modules
    /// </summary>
    IEnumerable<IModules> Modules { get; }
}

/// <summary>
/// Module
/// </summary>
/// <param name="Name">Name how person would call it</param>
/// <param name="Key">Key how system would describe it</param>
/// <param name="Scripts">list of module scripts</param>
/// <param name="Data">Data - basically JSON array</param>
public interface IModules
{
    string Name { get; set; }
    string Key { get; set; }
    IEnumerable<IScripts> Scripts { get; }
    IEnumerable<Dictionary<string, object>> Data { get; set; }
}

///; <summary>
/// Scripts for modules and global scripts
/// </summary>
/// <param name="Name">Command name - Displayname</param>
/// <param name="Id">System ID</param>
/// <param name="IsDefault">Double click default value - works only for module commands</param>
/// <param name="IsContext">If its context or global script</param>
/// <param name="IsImport">Is command for importing data</param>
public interface IScripts
{
    /// <summary>
    /// Script name
    /// </summary>
    string Name { get; set; }

    /// <summary>
    /// Script system key
    /// </summary>
    string Id { get; set; }

    /// <summary>
    /// Double click default action
    /// </summary>
    [DefaultValue(false)]
    bool IsDefault { get; set; }

    /// <summary>
    /// If its module or global
    /// </summary>
    [DefaultValue(true)]
    bool IsContext { get; set; }

    /// <summary>
    /// If its for import data to table
    /// </summary>
    [DefaultValue(false)]
    bool IsImport { get; set; }
}