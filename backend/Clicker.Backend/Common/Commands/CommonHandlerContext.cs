using AutoMapper;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Common.Commands
{
    /// <summary>
    /// Společný kontext pro všechny handlery implementuje ho třída CommonHandler
    /// </summary>
    public class CommonHandlerContext<T> : ICommonHandlerContext<T>
    {
        public IMapper Mapper { get; set; }
        public IClickerValidator<T> Validator { get; set; }
        public ILogger<T> Logger { get; set; }
        
        // ReSharper disable once ContextualLoggerProblem
        /// <summary>
        /// Společný kontext pro všechny handlery mediatru. Lze měnit společné věci na jednom místě
        /// </summary>
        /// <param name="services"></param>
        /// <param name="mapper"></param>
        /// <param name="logger"></param>
        /// <exception cref="ArgumentNullException"></exception>
        public CommonHandlerContext(IServiceProvider services, IMapper mapper, ILogger<T> logger)
        {
            Mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            Validator = services.GetService<IClickerValidator<T>>(); // throw new ArgumentNullException(nameof(validator));
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
    }
}