namespace Clicker.Backend.Common.Exceptions
{
    /// <summary>
    /// General exception from core/backend
    /// </summary>
    public class CoreException : Exception
    {
        public CoreException(string message) : base(message)
        { }

        public CoreException(string message, Exception ex) : base(message, ex)
        { }
    }
}