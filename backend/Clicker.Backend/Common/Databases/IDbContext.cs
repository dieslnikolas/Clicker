using Clicker.Backend.Settings;

namespace Clicker.Backend.Common.Databases;

public interface IDbContext
{

    /// <summary>
    /// Sets settings file path
    /// </summary>
    /// <param name="filePath"></param>
    /// <returns></returns>
    void SetConnectionString(string? filePath);

    /// <summary>
    /// Current project settings
    /// </summary>
    IProject Project { get; set; }
    
    /// <summary>
    /// User config its global between projects
    /// </summary>
    IUser User { get; set; }

}