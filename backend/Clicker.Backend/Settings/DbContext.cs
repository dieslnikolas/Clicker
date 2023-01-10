using System.Configuration;
using System.Security.Claims;
using Clicker.Backend.Common;
using Clicker.Backend.Common.Databases;
using Config.Net;

namespace Clicker.Backend.Settings;

public class DbContext : IDbContext
{
    /// <summary>
    /// Path to config file
    /// </summary>
    public string? ProjectFile { get; set; }
    
    private bool isInitialized = false;

    private IProject? _project;

    public IProject? Project
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
            throw new ApplicationException("Project file not set");

        if (string.IsNullOrEmpty(ProjectFile))
            throw new ConfigurationErrorsException("Config.NET path is not set");
    }

    private IUser? _user;

    public IUser? User
    {
        get
        {
            CheckSetup();
            return _user;
        }
        set { _user = value; }
    }

    public DbContext(IHttpContextAccessor httpContextAccessor)
    {
        if (TryGetconnectionStringFromClaim(httpContextAccessor, out var conStr))
            SetConnectionString(conStr);
    }

    /// <inheritdoc />
    public void SetConnectionString(string? filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            throw new ArgumentException("Filepath must not be empty");

        // AppData
        var appDataFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), 
            ".clicker/user_settings.json");

        // set settings path
        ProjectFile = filePath;

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
    
    /// <summary>
    /// Tryies read connection string from claims (path to project realy)
    /// </summary>
    /// <param name="httpContextAccessor"></param>
    /// <param name="s"></param>
    /// <returns></returns>
    private bool TryGetconnectionStringFromClaim(IHttpContextAccessor httpContextAccessor, out string s)
    {
        try
        {
            s = httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "ConnectionString").FirstOrDefault().Value;
            return true;
        }
        catch (Exception ex)
        {
            s = null;
            return false;
        }
    }
}