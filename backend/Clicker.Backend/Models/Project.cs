using Clicker.Backend.Common;

namespace Clicker.Backend.Models;

public record ProjectRequest(string DisplayName);
public record ProjectResponse() : IApiResponse {}

