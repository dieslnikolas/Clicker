using System.ComponentModel;

namespace Clicker.Backend.Settings;


///; <summary>
/// Scripts for modules and global scripts
/// </summary>
/// <param name="Name">Command name - Displayname</param>
/// <param name="Id">System ID</param>
/// <param name="IsDefault">Double click default value - works only for module commands</param>
/// <param name="IsContext">If its context or global script</param>
/// <param name="IsImport">Is command for importing data</param>
public interface IScript
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