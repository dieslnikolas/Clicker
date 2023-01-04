namespace Clicker.Backend.Common.Repository;

/// <summary>
/// Basic repostiry commands
/// </summary>
public interface IRepository
{
    /// <summary>
    /// Path to JSON file configuration
    /// </summary>
    public string JsonFilePath { get; set; }
    
    /// <summary>
    /// Adds record
    /// </summary>
    Task Insert(IEntity input);

    /// <summary>
    /// Updates one record
    /// </summary>
    Task Update(IEntity input);

    /// <summary>
    /// Deletes record
    /// </summary>
    Task Delete(IEntity input);
    
    /// <summary>
    /// Gets record
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    Task<IEntity> Get(string key);
    
    /// <summary>
    /// Finds All Records
    /// </summary>
    /// <returns></returns>
    Task<IEnumerable<IEntity>> FindAll();
}