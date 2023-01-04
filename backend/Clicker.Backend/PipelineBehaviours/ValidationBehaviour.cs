using Clicker.Backend.Common.Validations;
using Clicker.Backend.Exceptions;
using MediatR;

namespace Clicker.Backend.PipelineBehaviours
{
    
    /// <summary>
    /// Validate request before it runs handler itself
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    public class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly IEnumerable<IClickerValidator<TRequest>> _validators;
        
        public ValidationBehaviour(IEnumerable<IClickerValidator<TRequest>> validators)
        {
            _validators = validators;
        }
        
        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // Validations - throws exception if error
            await IsRequestInvalid(request, cancellationToken);

            // Next step 
            return await next();
        }
        
        #region Validace
        
        /// <summary>
        /// Runs validations
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        private async Task<bool> IsRequestInvalid(TRequest request, CancellationToken cancellationToken)
        {
            // Argument check
            if (request == null) throw new ArgumentNullException(nameof(request));
            
            // FluentValidations if there are any
            // ReSharper disable once ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract
            if (_validators == null) return false;
            
            // VALIDATE
            var validationResults = await ValidationResults(request, cancellationToken);
            
            // Check results
            if (validationResults !=null && validationResults.Any())
            {
                // ReSharper disable once PossibleNullReferenceException
                throw new ValidationException(validationResults.ToList());
            }

            return false;
        }

        /// <summary>
        /// Get validation results and validate request
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        private async Task<IList<ValidationMessage>> ValidationResults(TRequest request, CancellationToken cancellationToken)
        {
            var validationResults =
               
                // Validate ALL validators for command/query
                (await Task.WhenAll(_validators.Select(v => v.ValidateAsync(request, cancellationToken))))
                
                // Connect all validation results together
                .SelectMany(message => message)
                
                // To list
                .ToList();
            
            // return
            return validationResults;
        }

        #endregion
    }
}