using Microsoft.OpenApi.Models;

namespace Clicker.Backend.Common.Authorization;

/// <summary>
/// Some helper methods for open api security
/// </summary>
public static class OpenApiSecurityHelpers
{
    /// <summary>
    /// Get security scheme
    /// </summary>
    /// <returns></returns>
    public static OpenApiSecurityScheme GetScheme()
    {
        return new OpenApiSecurityScheme()
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JSON Web Token based security",
        };
    }
    
/// <summary>
/// Get Security requirement
/// </summary>
/// <returns></returns>
    public static OpenApiSecurityRequirement GetSchemeRequirement()
    {
        return new OpenApiSecurityRequirement()
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        };
    }

    /// <summary>
    /// Get contact
    /// </summary>
    /// <returns></returns>
    public static OpenApiContact GetContact()
    {
        return new OpenApiContact()
        {
            Name = "Nikolas Diesl",
            Email = "dieslnikolas@gmail.com",
            Url = new Uri("https://github.com/dieslnikolas/Clicker")
        };
    }

    /// <summary>
    /// Get Licence
    /// </summary>
    /// <returns></returns>
    public static OpenApiLicense GetLicence()
    {
        return new OpenApiLicense()
        {
            Name = "Free License",
            Url = new Uri("https://github.com/dieslnikolas/Clicker")
        };
    }

    /// <summary>
    /// Get open api info
    /// </summary>
    /// <returns></returns>
    public static OpenApiInfo GetInfo()
    {
        return new OpenApiInfo()
        {
            Title = "Clicker.Backend",
            Description = "Backend for electron based application",
            TermsOfService = new Uri("https://github.com/dieslnikolas/Clicker"),
            Contact = GetContact(),
            License = GetLicence()
        };
    }
}