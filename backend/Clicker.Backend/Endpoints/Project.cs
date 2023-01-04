using Clicker.Backend.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clicker.Backend.Endpoints;

public class Project : IEndpoint
{
    private readonly ILogger<Project> _logger;
    private readonly IMediator _mediator;

    public Project(ILogger<Project> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    
    /// <inheritdoc cref="IEndpoint.RegisterRoutes" />
    public void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Project", () => new ProjectResponse());
        app.MapPost("/Project", (ProjectRequest request) => new ProjectResponse());
        app.MapPatch("/Project", (ProjectRequest request) => Results.Ok());
        app.MapDelete("/Project", () => Results.Ok());
    }
}