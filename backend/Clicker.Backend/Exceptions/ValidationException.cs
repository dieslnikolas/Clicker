using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Exceptions
{
    /// <summary>
    /// Vrací validační hlášky
    /// </summary>
    public class ValidationException : Exception
    {
        public IList<ValidationMessage> ToList { get; }

        public ValidationException(IList<ValidationMessage> toList) : base("Validation message")
        {
            ToList = toList;
        }
    }
}