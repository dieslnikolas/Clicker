namespace Clicker.Backend.Common.Exceptions
{
    /// <summary>
    /// Permission error
    /// </summary>
    public class AccessDeniedException : Exception
    {
        private const string DefaultErrorMessage = "You dont have permission to this operation";

        public AccessDeniedException() :this(DefaultErrorMessage) { }

        public AccessDeniedException(Exception ex) : base(DefaultErrorMessage, ex) { }

        public AccessDeniedException(string message) : base(message) { }

        public AccessDeniedException(string message, Exception ex) : base(message, ex) { }
    }
}