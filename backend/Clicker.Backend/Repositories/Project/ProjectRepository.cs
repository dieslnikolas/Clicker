using Clicker.Backend.Common.Repository;

namespace Clicker.Backend.Repositories.Project;

public class ProjectRepository : IProjectRepository
{
    /// <inheritdoc />
    public string JsonFilePath { get; set; }
    
    /// <inheritdoc />
    public Task Insert(IEntity input)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task Update(IEntity input)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task Delete(IEntity input)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<IEntity> Get(string key)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<IEnumerable<IEntity>> FindAll()
    {
        throw new NotImplementedException();
    }
}