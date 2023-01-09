using AutoMapper;
using Clicker.Backend.Common.UseCases;
using MediatR;
using Clicker.Backend.Extensions;

namespace Clicker.Backend.Common;

/// <summary>
/// This class represnets endpoint 
/// </summary>
public class Context
{
    /// <summary>
    /// Mediator
    /// </summary>
    private readonly IMediator _mediator;
    
    /// <summary>
    /// Mapper
    /// </summary>
    private readonly IMapper _mapper;

    /// <summary>
    /// Create endpoint request context
    /// </summary>
    /// <param name="request"></param>
    /// <param name="mediator"></param>
    /// <param name="mapper"></param>
    /// <exception cref="ArgumentException"></exception>
    public Context(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
    }
    
    /// <summary>
    /// Bridge HTTP request to mediator
    /// </summary>
    /// <returns></returns>
    public async Task<TResponse> SendQuery<TQuery, TResponse>(object request, CancellationToken token = default) 
        where TQuery : IQuery 
        where TResponse : IApiResponse
    {
        return await _mediator.SendQuery<TQuery, TResponse>(_mapper, request!, token);
    }
    
    /// <summary>
    /// Bridge HTTP request to mediator
    /// </summary>
    /// <returns></returns>
    public async Task<TResponse> SendCommand<TCommand, TResponse>(object request, CancellationToken token = default) 
        where TCommand : ICommand
        where TResponse : IApiResponse
    {
        return await _mediator.SendCommand<TCommand, TResponse>(_mapper, request!, token);
    }
}