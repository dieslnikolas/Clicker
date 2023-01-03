using System.Reflection;
using MediatR;

namespace Clicker.Backend.PipelineBehaviours;

public class LoggingPipeline<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingPipeline<TRequest, TResponse>> _logger;
    
    public LoggingPipeline(ILogger<LoggingPipeline<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }
    
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        //Request
        _logger.LogInformation("Handling {Name}", typeof(TRequest).Name);

        // Log request models
        LogRequest(request);

        // Next pipeline
        var response = await next();
        
        //Response
        _logger.LogInformation("Handled {Name}", typeof(TResponse).Name);
        
        return response;
    }

    private void LogRequest(TRequest request)
    {
        IList<PropertyInfo> props = new List<PropertyInfo>(request!.GetType().GetProperties());
        foreach (var prop in props)
        {
            var propValue = prop.GetValue(request, null);
            _logger.LogInformation("{Property} : {@Value}", prop.Name, propValue);
        }
    }

}