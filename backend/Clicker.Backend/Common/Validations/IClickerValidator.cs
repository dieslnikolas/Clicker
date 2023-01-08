namespace Clicker.Backend.Common.Validations
{
    public interface IClickerValidator<in T>
    {
        /// <summary>
        /// Spousti validator
        /// </summary>
        /// <param name="instance"></param>
        /// <param name="cancellation"></param>
        /// <returns></returns>
        Task<IList<ValidationMessage>> ValidateAsync(T instance, CancellationToken cancellation = default);

        /// <summary>
        /// Zda validace prošla
        /// </summary>
        bool IsValid();
    }
}