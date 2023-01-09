using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Exceptions
{
    /// <summary>
    /// Vrací validační hlášky
    /// </summary>
    public class ValidationException : Exception
    {
        public IList<ValidationMessage> Messages { get; }

        public ValidationException(IList<ValidationMessage> messages) : base("Validation message")
        {
            Messages = messages;
        }
    }
}