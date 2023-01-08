using Clicker.Backend.Settings;

namespace Clicker.Backend.Common;

public interface IDbContext
{

    /// <summary>
    /// Sets settings file path
    /// </summary>
    /// <param name="filePath"></param>
    /// <returns></returns>
    Task SetConnectionString(string filePath);

    /// <summary>
    /// Returns settings file path
    /// </summary>
    public string ConnectionString { get; }

    /// <summary>
    /// Current project settings
    /// </summary>
    IProject Project { get; set; }
    
    /// <summary>
    /// User config its global between projects
    /// </summary>
    IUser User { get; set; }

}