namespace Clicker.Backend.Common.Databases;

public interface IDbContext
{
    /// <summary>
    /// Gets settings file path (project)
    /// </summary>
    /// <returns></returns>
    Task<string> GetProjectJsonFilePath();
    
    /// <summary>
    /// Gets settings file path (user/global settings )
    /// </summary>
    /// <returns></returns>
    Task<string> GetUserJsonFilePath();

    /// <summary>
    /// Sets settings file path
    /// </summary>
    /// <param name="filePath"></param>
    /// <returns></returns>
    Task SetProjectJsonFilePath(string? filePath);

    /// <summary>
    /// Get entity 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    Task<T> Get<T>();

    /// <summary>
    /// Set entity
    /// </summary>
    /// <param name="model"></param>
    /// <typeparam name="T"></typeparam>
    Task SaveChanges<T>(T model);

}