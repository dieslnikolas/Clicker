using AutoMapper;
using Clicker.Backend.Common.Validations;
using MediatR;

namespace Clicker.Backend.Common.UseCases
{
    
    /// <summary>
    /// Pomocná třída pro handlery. Nabízí společný kontext a zjednodušené generování handleru
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    public abstract class CommonHandler<TRequest, TResponse> : ICommonHandler<TRequest, TResponse>, IRequestHandler<TRequest, TResponse> 
        where TRequest : IRequest<TResponse> where TResponse : new()
    {
        public ICommonHandlerContext<TRequest> Context { get; }

        /// <summary>
        /// Mapper - Pro jednodušší používání, stejné jako Context.Mapper
        /// </summary>
        protected IMapper _mapper => Context.Mapper;
        
        /// <summary>
        /// Validátor - Pro jednodušší používání, stejné jako Context.Validator
        /// </summary>
        protected IClickerValidator<TRequest>? _validator => Context.Validator;
        
        /// <summary>
        /// Logování - Pro jednodušší používání, stejné jako Context.Logger
        /// </summary>
        protected ILogger<TRequest> _logger => Context.Logger;
        
        protected CommonHandler(ICommonHandlerContext<TRequest> context)
        {
            Context = context;
        }

        #region Handling

        /// <summary>
        /// Spouští handling metod
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
        
        
        #endregion
        
    }
}