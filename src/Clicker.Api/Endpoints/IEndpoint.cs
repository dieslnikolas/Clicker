namespace Clicker.Api.Endpoints
{
    /// <summary>
    /// Interface for marking nedpoints
    /// </summary>
    public interface IEndpoint
    {
        /// <summary>
        /// Register endpoint addresses
        /// </summary>
        /// <param name="app">Web application</param>
        void Register(WebApplication app);
    }
}