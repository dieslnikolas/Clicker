namespace Clicker.Backend.Common;

public interface IEndpoint
{
    /// <summary>
    /// Register API Routes
    /// </summary>
    /// <param name="app">Web application itselfs</param>
    void RegisterRoutes(WebApplication app);
}