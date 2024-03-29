using AutoMapper;
using Clicker.Backend.Common.Commands;
using Clicker.Backend.Common.Responses;
using MediatR;
using ICommand = Clicker.Backend.Common.Commands.ICommand;

namespace Clicker.Backend.Common.Extensions;

/// <summary>
/// Extensions methods for mediatr for easier callign in minimal api
/// </summary>
public static class MediatrExtensions
{
    /// <summary>
    /// Helper for easier calling mediatr
    /// </summary>
    /// <param name="mediator"></param>
    /// <param name="mapper"></param>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <typeparam name="TCommand"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    public static async Task<TResponse> SendCommand<TCommand, TResponse>(this IMediator mediator, IMapper mapper, object request, CancellationToken cancellationToken) 
        where TCommand : ICommand
        where TResponse : IApiResponse
    {
        return await SendInternal<TCommand, TResponse>(mediator, mapper, request, cancellationToken);
    }

    /// <summary>
    /// Helper for easier calling mediatr
    /// </summary>
    /// <param name="mediator"></param>
    /// <param name="mapper"></param>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <typeparam name="TQuery"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    public static async Task<TResponse> SendQuery<TQuery, TResponse>(this IMediator mediator, IMapper mapper, object request, CancellationToken cancellationToken) 
        where TQuery : IQuery
        where TResponse : IApiResponse
    {
        return await SendInternal<TQuery, TResponse>(mediator, mapper, request,cancellationToken);
    }

    private static async Task<TResponse> SendInternal<TCommand, TResponse>(ISender mediator, IMapperBase mapper, object request, CancellationToken cancellationToken) where TResponse : IApiResponse
    {
        // Command mapping from request
        var command = mapper.Map<TCommand>(request);
        if (command == null) throw new InvalidOperationException();

        // Mediator
        var model = await mediator.Send(command, cancellationToken);

        // Mapping result
        return mapper.Map<TResponse>(model);
    }
}