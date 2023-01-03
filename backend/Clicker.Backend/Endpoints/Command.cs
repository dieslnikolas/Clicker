using AutoMapper;
using Clicker.Backend.Common;
using Clicker.Backend.Extensions;
using Clicker.Backend.Models;
using Clicker.Backend.UseCases.Command;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clicker.Backend.Endpoints;

public class Command : IEndpoint
{
    private readonly ILogger<Command> _logger;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    public Command(ILogger<Command> logger, IMediator mediator, IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
        _mediator = mediator;
    }
    
    /// <inheritdoc cref="IEndpoint.RegisterRoutes" />
    public void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Command", async (string? id) => await _mediator.SendQuery<CommandQuery, CommandResponse>(_mapper, id));
        app.MapPost("/Command", (CommandRequest request) => new CommandResponse());
        app.MapPatch("/Command", (CommandRequest request) => Results.Ok());
        app.MapDelete("/Command", (string id) => Results.Ok());
    }
}