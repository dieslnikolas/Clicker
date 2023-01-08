using FluentValidation;
using FluentValidation.Results;

namespace Clicker.Backend.Common.Validations
{
    public abstract class Validator<T> : FluentValidation.AbstractValidator<T>, IClickerValidator<T>
    {
        private ValidationResult _result = new ValidationResult();

        /// <summary>
        /// Vrací komand/query
        /// </summary>
        public T Command { get; set; }
        
        /// <inheritdoc cref="IValidator.ValidateAsync" />
        async Task<IList<ValidationMessage>> IClickerValidator<T>.ValidateAsync(T instance, CancellationToken cancellation = default)
        {
            if (Command == null)
                Command = instance;
            
            _result = await this.ValidateAsync(instance, cancellation);
            return CollectValidations(_result);
        }
        

        /// <inheritdoc cref="IValidator{T}.IsValid" />
        public bool IsValid()
        {
            return _result.IsValid;
        }
        
        private static IList<ValidationMessage> CollectValidations(ValidationResult result)
        {
            IList<ValidationMessage> validations = new List<ValidationMessage>();
            foreach (var error in result.Errors)
            {
                validations.Add(new ValidationMessage
                {
                    DisplayName = error.ErrorMessage,
                    Property = error.PropertyName,
                    ResourceName = error.ErrorMessage,
                    Args = null
                });
            }

            return validations;
        }
    }
}