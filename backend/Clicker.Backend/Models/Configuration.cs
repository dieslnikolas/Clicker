using Clicker.Backend.Common;

namespace Clicker.Backend.Models;

public record ConfigurationRequest(string DisplayName);
public record ConfigurationResponse() : IApiResponse {} 

