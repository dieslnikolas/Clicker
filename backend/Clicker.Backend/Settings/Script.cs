using System.ComponentModel;

namespace Clicker.Backend.Settings;

public class Script
{
    /// <summary>
    /// Script name
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Script system key
    /// </summary>
    public string Key { get; set; }

    /// <summary>
    /// Double click default action
    /// </summary>
    [DefaultValue(false)]
    public bool IsDefault { get; set; }

    /// <summary>
    /// If its module or global
    /// </summary>
    [DefaultValue(true)]
    public bool IsContext { get; set; }

    /// <summary>
    /// If its for import data to table
    /// </summary>
    [DefaultValue(false)]
    public bool IsImport { get; set; }
}