using System.ComponentModel;

namespace Clicker.Backend.Settings;

public interface IUser
{
    string LastProject { get; set; }
    
    [DefaultValue(true)]
    bool IsFirstTimeUser { get; set; }
}