using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Common;

public interface IApiResponse
{
    /// <summary>
    /// Zda se povedlo
    /// </summary>
    // ReSharper disable once ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract
    public bool IsSuccess => Exception == null && (Validation == null || Validation.Any());

    /// <summary>
    /// Výjimka
    /// </summary>
    public Exception Exception { get; set; }

    /// <summary>
    /// Validace
    /// </summary>
    public IList<ValidationMessage> Validation { get; set; }
}