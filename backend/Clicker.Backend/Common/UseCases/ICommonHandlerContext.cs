using AutoMapper;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Common.UseCases
{
    public interface ICommonHandlerContext<T>
    {
        /// <summary>
        /// Automapper
        /// </summary>
        IMapper Mapper { get; }

        /// <summary>
        /// Validace
        /// </summary>
        IClickerValidator<T> Validator { get; }

        /// <summary>
        /// Logování
        /// </summary>
        ILogger<T> Logger { get; }
    }
}