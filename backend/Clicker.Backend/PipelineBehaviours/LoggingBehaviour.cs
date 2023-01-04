using System.Text;
using MediatR;

namespace Clicker.Backend.PipelineBehaviours
{
    /// <summary>
    /// Logs every commadn and query
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    public class LoggingBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly ILogger<LoggingBehaviour<TRequest, TResponse>> _logger;

        public LoggingBehaviour(ILogger<LoggingBehaviour<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // Request correlation ID
            var correlationId = Guid.NewGuid();
            
            // *** Request ***
            // Command/Query
            var logMessage = new StringBuilder();
            logMessage.AppendFormat("(ID Command: {0}) Handling {1}", correlationId, typeof(TRequest).Name);
            
            // Properties
            foreach (var prop in request.GetType().GetProperties())
                logMessage.AppendFormat(" {0}:{1}", prop.Name, prop.GetValue(request, null));
            
            // ReSharper disable once TemplateIsNotCompileTimeConstantProblem
            _logger.LogInformation(logMessage.ToString());
            
            // *** Handler *** 
            var response = await next();
            
            // *** Response ***
            _logger.LogInformation("(ID Command: {CorrelationId}) Handled {Name}", correlationId, typeof(TResponse).Name);
            return response;
        }
    }
}