namespace Clicker.Backend.Settings;

public class Module
{
    public string Name { get; set; }
    public string Key { get; set; }
    public IList<Script> Scripts { get; }
    public IList<Dictionary<string, object>> Data { get; set; }
}