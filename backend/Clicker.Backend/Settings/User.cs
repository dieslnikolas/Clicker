using System.ComponentModel;

namespace Clicker.Backend.Settings;

public class User
{
    public string LastProject { get; set; }
    
    [DefaultValue(true)]
    public bool IsFirstTimeUser { get; set; }
}