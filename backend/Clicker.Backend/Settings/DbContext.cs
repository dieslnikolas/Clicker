﻿using System.Text.Json;
using Clicker.Backend.Common.Databases;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Clicker.Backend.Settings;

public class DbContext : IDbContext
{
    /// <summary>
    /// Path to config file
    /// </summary>
    private string? ProjectFile { get; set; }

    /// <summary>
    /// App data folder based on OS
    /// </summary>
    private static string UserFile
    {
        get
        {
            var appDataFolder = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                ".clicker/user_settings.json");
            return appDataFolder;
        }
    }

    /// <summary>
    /// Helper if context has been initialised
    /// </summary>
    private bool _isInitialized = false;

    public DbContext(IHttpContextAccessor httpContextAccessor)
    {
        if (TryGetconnectionStringFromClaim(httpContextAccessor, out var conStr))
             SetProjectJsonFilePath(conStr)
                 .GetAwaiter()
                 .GetResult();
    }

    /// <inheritdoc />
    public async Task<T> Get<T>()
    {
        // Trhrows error if it dont work
        await CheckSetup();

        throw new NotImplementedException();
        // Read
        // return JsonSerializer.Deserialize<T>(GetPath<T>()!);
        
        // kontrola parametru
        // if (filePath == null) throw new ArgumentNullException(nameof(filePath));
        //
        // // přečtení dat
        // var serializer = new JsonSerializer();
        // var file = new JsonTextReader(new StreamReader(filePath));
        // var jobs = serializer.Deserialize<IEnumerable<CronJob>>(file);
        // return jobs;

        // Return default
        return default(T);
    }


    /// <inheritdoc />
    public async Task SaveChanges<T>(T model)
    {
        // Trhrows error if it dont work
        await CheckSetup();

        throw new NotImplementedException();
        
        // // Writer
        // var resultBytes = JsonSerializer.SerializeToUtf8Bytes(model, new JsonSerializerOptions { WriteIndented = false });
        // using var jsonWriter = new FileStream(resultBytes);
        //
        // // Write
        // await JsonSerializer.SerializeAsync(jsonWriter, model);
        // await jsonWriter.WriteAsync();
        // jsonWriter.Flush();
    }
    
    /// <inheritdoc />
    public async Task<string> GetProjectJsonFilePath()
    {
        return ProjectFile;
    }

    /// <inheritdoc />
    public async Task<string> GetUserJsonFilePath()
    {
        return UserFile;
    }

    /// <inheritdoc />
    public async Task SetProjectJsonFilePath(string? filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            throw new ArgumentException("Filepath must not be empty");

        // set settings path
        ProjectFile = filePath;

        // After succesfull initialisation 
        _isInitialized = true;
        
        // Check
        await CheckSetup();

    }

    #region Private methods

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

    /// <summary>
    /// Check if context has everything it needs
    /// </summary>
    /// <exception cref="ApplicationException"></exception>
    /// <exception cref="Exception"></exception>
    private async Task CheckSetup()
    {
        if (!_isInitialized)
            throw new ApplicationException("Project file not set");

        if (string.IsNullOrEmpty(ProjectFile))
            throw new Exception("Path is not set");
    }
    
    /// <summary>
    /// Get file path based on settins type (global vs project)
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    private string GetPath<T>()
    {
        // This is ugly bullshit, dont do it like this
        var path = typeof(T) is User ? UserFile : ProjectFile;
        return path!;
    }

    #endregion
    
    
}