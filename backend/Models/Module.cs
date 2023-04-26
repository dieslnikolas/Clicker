namespace Clicker.Backend.Models;

public class Module
{
    public string Name { get; set; }
    public string Key { get; set; }
    public IList<Script> Scripts { get; } = new List<Script>();
    public IList<Dictionary<string, object>> Data { get; set; } = new List<Dictionary<string, object>>();
}