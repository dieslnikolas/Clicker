using Clicker.Backend.Common;

namespace Clicker.Backend.Models;

public record ModuleRequest(string DisplayName);
public record ModuleResponse() : IApiResponse {}

