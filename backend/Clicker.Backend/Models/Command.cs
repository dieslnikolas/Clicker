using Clicker.Backend.Common;

namespace Clicker.Backend.Models;

public record CommandRequest
{
    public string Displayname { get; set; }
}

public record CommandResponse : IApiResponse
{
    
}