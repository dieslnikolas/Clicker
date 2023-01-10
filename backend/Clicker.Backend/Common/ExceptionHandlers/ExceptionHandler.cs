using Clicker.Backend.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.Features;

namespace Clicker.Backend.Common.ExceptionHandlers;

public class ExceptionHandler
{
    
    public static async Task Handle(HttpContext context)
    {
        // Service provider
        var sp = context.Features.Get<IServiceProvidersFeature>()!.RequestServices;
        var exception = context.Features.Get<IExceptionHandlerFeature>()!.Error;
        var logger = sp.GetService<ILogger>();
        
        // Write to log
        // logger.LogError(exception, "Error");
        
        // Authorization problem
        if (exception is AccessDeniedException)
            await Results.Unauthorized().ExecuteAsync(context);

        // Validation problem
        if (exception is ValidationException)
            await Results.BadRequest(((ValidationException)exception).Messages).ExecuteAsync(context);
        
        // Generic error
        else await Results.Problem(exception.Message).ExecuteAsync(context);
        
        await Task.CompletedTask;
    }
}