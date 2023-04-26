using AutoMapper;
using Clicker.Backend.Common.Databases;
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
        
        /// <inheritdoc cref="DbContext" />
        public IDbContext DbContext { get; }

        // ReSharper disable once ContextualLoggerProblem
        /// <summary>
        /// Společný kontext pro všechny handlery mediatru. Lze měnit společné věci na jednom místě
        /// </summary>
        /// <param name="services"></param>
        /// <param name="mapper"></param>
        /// <param name="logger"></param>
        /// <param name="clickerValidator"></param>
        /// <param name="dbContext"></param>
        /// <exception cref="ArgumentNullException"></exception>
        public CommonHandlerContext(IMapper mapper, ILogger<T> logger, IClickerValidator<T> clickerValidator, IDbContext dbContext)
        {
            Mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            Validator = clickerValidator ?? throw new ArgumentNullException(nameof(clickerValidator));;
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));
            DbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }
    }
}