using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Clicker.Backend.Exceptions;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.Common.Authorization;

public class Jwt
{
    private const string CfgRoot = "Authentication:Schemes:Bearer"; 
    
    public static byte[] GetSecret(IConfiguration cfg) => Encoding.UTF8.GetBytes(cfg[$"{CfgRoot}:Key"]);
    public static string GetIssuer(IConfiguration cfg) => cfg[$"{CfgRoot}:ValidIssuer"];
    public static string GetAudience(IConfiguration cfg) => cfg[$"{CfgRoot}:ValidAudiences"];
    
    /// <summary>
    /// Creates JWT token
    /// </summary>
    /// <returns></returns>ß
    public static string GetToken(string path, string id, string author, string keyapi, IConfiguration cfg)
    {
        if (keyapi != "KEY") throw new AccessDeniedException("Wrong key");

        // Keys
        var tokenHandler = new JwtSecurityTokenHandler();
        var issuer = GetIssuer(cfg);
        var audience = GetAudience(cfg);
        var key = GetSecret(cfg);
        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
        
        // Claims
        var claims = new ClaimsIdentity(new[]
        {
            new Claim("Id", id),
            new Claim("Author", author),
            new Claim("ConnectionString", path),
        });
        
        // JWT Payload
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            // Claims
            Subject = claims,
            
            // Issuers and Audience
            Issuer = issuer,
            IssuedAt = DateTime.UtcNow,
            Audience = audience,
            
            // Neverending stoooory
            Expires = DateTime.UtcNow.AddYears(10),
            
            // Credentials
            SigningCredentials = credentials
        };

        // Token
        var token = tokenHandler.CreateToken(tokenDescriptor);

        // Return Token
        return tokenHandler.WriteToken(token);
    }
}