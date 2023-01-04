using Clicker.Backend.Common;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Endpoints;

public record ProjectRequest(string DisplayName);
public record ProjectResponse : IApiResponse
{
    public Exception Exception { get; set; }
    public IList<ValidationMessage> Validation { get; set; }
}

