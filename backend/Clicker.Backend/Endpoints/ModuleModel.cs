using Clicker.Backend.Common;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Endpoints;

public record ModuleRequest(string DisplayName);
public record ModuleResponse : IApiResponse
{
    public Exception Exception { get; set; }
    public IList<ValidationMessage> Validation { get; set; }
}

