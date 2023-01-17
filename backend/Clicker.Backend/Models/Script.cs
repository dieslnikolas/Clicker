namespace Clicker.Backend.Models;

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
    public bool IsDefault { get; set; } = false;

    /// <summary>
    /// If its module or global
    /// </summary>
    public bool IsContext { get; set; } = true;

    /// <summary>
    /// If its for import data to table
    /// </summary>
    public bool IsImport { get; set; } = false;
}