using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.Common.Authorizations;

public class JwtAuthorization
{
    /// <summary>
    /// Setup JWT Validations a requirements
    /// </summary>
    /// <param name="options"></param>
    /// <param name="config"></param>
    public static void SetupJwtRequirements(JwtBearerOptions options, IConfiguration config)
    {
        // Allow HTTPS token (bad and ugly)
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Key
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(JwtProvider.GetSecret(config)),
                    
            // Isuer
            ValidateIssuer = true,
            ValidIssuer = JwtProvider.GetIssuer(config),
                    
            // Audience
            ValidateAudience = true,
            ValidAudience = JwtProvider.GetAudience(config)
        };
    }

    /// <summary>
    /// Sets up default schemes 
    /// </summary>
    /// <param name="options"></param>
    public static void SetupDefaultSchemes(AuthenticationOptions options)
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    }
}