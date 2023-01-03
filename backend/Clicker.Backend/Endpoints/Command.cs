using Clicker.Backend.Common;
using Clicker.Backend.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clicker.Backend.Endpoints;

public class Command : IEndpoint
{
    private readonly ILogger<Command> _logger;
    private readonly IMediator _mediator;

    public Command(ILogger<Command> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    
    /// <inheritdoc cref="IEndpoint.RegisterRoutes" />
    public void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Command", (string? id) => new CommandResponse());
        app.MapPost("/Command", (CommandRequest request) => new CommandResponse());
        app.MapPatch("/Command", (CommandRequest request) => Results.Ok());
        app.MapDelete("/Command", (string id) => Results.Ok());
    }
}