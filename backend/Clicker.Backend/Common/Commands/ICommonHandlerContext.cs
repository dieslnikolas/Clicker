using AutoMapper;
using Clicker.Backend.Common.Databases;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Common.Commands
{
    public interface ICommonHandlerContext<T>
    {
        /// <summary>
        /// Automapper
        /// </summary>
        IMapper Mapper { get; }

        /// <summary>
        /// Validations
        /// </summary>
        IClickerValidator<T> Validator { get; }

        /// <summary>
        /// Logging
        /// </summary>
        ILogger<T> Logger { get; }
        
        /// <summary>
        /// DB context
        /// </summary>
        IDbContext DbContext { get; }
        
    }
}