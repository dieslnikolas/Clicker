using System.Configuration;
using Clicker.Backend.Common;
using Config.Net;

namespace Clicker.Backend.Settings;

public class ConfigNetWrapper : IDbContext
{
    /// <summary>
    /// Path to config file
    /// </summary>
    public string? ProjectFile { get; set; }
    
    private bool isInitialized = false;

    private IProject _project;

    public IProject Project
    {
        get
        {
            CheckSetup();
            return _project;
        }
        set { _project = value; }
    }

    private void CheckSetup()
    {
        if (!isInitialized)
            throw new ConfigurationException("Project file not set");

        if (string.IsNullOrEmpty(ProjectFile))
            throw new ConfigurationErrorsException("Config.NET path is not set");
    }

    private IUser _user;

    public IUser User
    {
        get
        {
            CheckSetup();
            return _user;
        }
        set { _user = value; }
    }

    public ConfigNetWrapper(IHttpContextAccessor httpContextAccessor)
    {
        var cstrinf = httpContextAccessor.HttpContext?.User?.FindFirst("ConnectionString");
        if (cstrinf != null)
            SetConnectionString(cstrinf.Value);
    }

    /// <inheritdoc />
    public async Task SetConnectionString(string? filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            throw new ArgumentException("Filepath must not be empty");

        // AppData
        var appDataFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), 
            ".clicker/user_settings.json");

        // set settings path
        await Task.FromResult(() => ProjectFile = filePath);

        // project settings
        Project = new ConfigurationBuilder<IProject>()
            .UseJsonFile(filePath)
            .Build();

        // project settings
        User = new ConfigurationBuilder<IUser>()
            .UseJsonFile(appDataFolder)
            .Build();

        // After succesfull initialisation 
        isInitialized = true;
        ProjectFile = filePath;
    }
}