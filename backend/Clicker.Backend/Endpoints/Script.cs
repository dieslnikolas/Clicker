using AutoMapper;
using Clicker.Backend.Common;
using Clicker.Backend.Extensions;
using Clicker.Backend.UseCases.Scripts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Clicker.Backend.Endpoints;

public class Script : IEndpoint
{
    private readonly ILogger<Script> _logger;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    public Script(ILogger<Script> logger, IMediator mediator, IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
        _mediator = mediator;
    }
    
    /// <inheritdoc cref="IEndpoint.RegisterRoutes" />
    public void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/Script", async ([AsParameters] ScriptRequest request, CancellationToken cancellationToken) => await _mediator.SendQuery<ScriptGetQuery, ScriptResponse>(_mapper, request, cancellationToken));
        app.MapPost("/Script", (ScriptRequest request) => new ScriptResponse());
        app.MapPost("/Script/Run", (ScriptRequest request) => new ScriptResponse());
        app.MapPatch("/Script", (ScriptRequest request) => Results.Ok());
        app.MapDelete("/Script", ([AsParameters] ScriptRequest request) => Results.Ok());
    }
}