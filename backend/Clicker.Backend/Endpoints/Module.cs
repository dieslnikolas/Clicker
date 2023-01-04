using Clicker.Backend.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clicker.Backend.Endpoints;

public class Module : IEndpoint
{
    private readonly ILogger<Module> _logger;
    private readonly IMediator _mediator;

    public Module(ILogger<Module> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    
    /// <inheritdoc cref="IEndpoint.RegisterRoutes" />
    public void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Module", (string? id) => new ModuleResponse());
        app.MapPost("/Module", (ModuleRequest request) => new ModuleResponse());
        app.MapPatch("/Module", (ModuleRequest request) => Results.Ok());
        app.MapDelete("/Module", (string? id) => Results.Ok());
    }
}