using Clicker.Backend.Common;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Endpoints;

public record ConfigurationRequest(string DisplayName);

public record ConfigurationResponse : IApiResponse
{
    public Exception Exception { get; set; }
    public IList<ValidationMessage> Validation { get; set; }
}  

