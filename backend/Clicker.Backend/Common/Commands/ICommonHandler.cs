namespace Clicker.Backend.Common.Commands
{
    /// <summary>
    /// Obaluje handler
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    public interface ICommonHandler<TRequest, TResponse>
    {
        /// <summary>
        /// Kontext
        /// </summary>
        // ReSharper disable once UnusedMemberInSuper.Global
        ICommonHandlerContext<TRequest> Context { get; }
    }
}