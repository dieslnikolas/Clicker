using System.Configuration;
using Clicker.Backend.Common;
using Config.Net;

namespace Clicker.Backend.Settings;

public class ConfigNetWrapper : IDbContext
{
    /// <summary>
    /// Path to config file
    /// </summary>
    private static string filePathInternal { get; set; }

    public string ConnectionString
    {
        get { return filePathInternal; }
    }


    private IProject _project;

    public IProject Project
    {
        get
        {
            if (string.IsNullOrEmpty(ConnectionString))
                throw new ConfigurationErrorsException("Config.NET path is not set");

            return _project;
        }
        set { _project = value; }
    }

    private IUser _user;

    public IUser User
    {
        get
        {
            if (string.IsNullOrEmpty(ConnectionString))
                throw new ConfigurationErrorsException("Config.NET path is not set");

            return _user;
        }
        set { _user = value; }
    }

    public ConfigNetWrapper()
    {
    }

    /// <inheritdoc />
    public async Task SetConnectionString(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            throw new ArgumentException("Filepath must not be empty");

        // set settings path
        await Task.FromResult(() => filePathInternal = filePath);

        // project settings
        Project = new ConfigurationBuilder<IProject>()
            .UseJsonFile("C:\\project.json")
            .Build();

        // project settings
        User = new ConfigurationBuilder<IUser>()
            .UseJsonFile("C:\\user.json")
            .Build();
    }
}