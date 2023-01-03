using Clicker.Backend.Common;
using Clicker.Backend.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clicker.Backend.Endpoints;

public class Configuration : IEndpoint
{
    private readonly ILogger<Configuration> _logger;
    private readonly IMediator _mediator;

    public Configuration(ILogger<Configuration> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    
    /// <inheritdoc cref="IEndpoint.RegisterRoutes" />
    public void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Configuration", (string? id) => new ConfigurationResponse());
        app.MapPost("/Configuration", (ConfigurationRequest request) => new ConfigurationResponse());
        app.MapPatch("/Configuration", (ConfigurationRequest request) => Results.Ok());
        app.MapDelete("/Configuration", (string id) => Results.Ok());
    }
}