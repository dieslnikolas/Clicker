using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Clicker.Backend.Exceptions;
using Microsoft.IdentityModel.Tokens;

namespace Clicker.Backend.Common.Authorization;

public class Jwt
{
    /// <summary>
    /// Creates JWT token
    /// </summary>
    /// <returns></returns>ß
    public static string GetToken(string path, string id, string author, string keyapi, IConfiguration cfg)
    {
        if (keyapi != "KEY") throw new AccessDeniedException("Wrong key");

        var issuer = cfg["Jwt:Issuer"];
        var audience = cfg["Jwt:Audience"];
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Now its ime to define the jwt token which will be responsible of creating our tokens
        var jwtTokenHandler = new JwtSecurityTokenHandler();

        // We get our secret from the appsettings
        var key = Encoding.ASCII.GetBytes(cfg["Jwt:Key"]);

        // we define our token descriptor
        // We need to utilise claims which are properties in our token which gives information about the token
        // which belong to the specific user who it belongs to
        // so it could contain their id, name, email the good part is that these information
        // are generated by our server and identity framework which is valid and trusted
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("Id", id),
                new Claim("Author", author),
                new Claim("Path", path),
                // the JTI is used for our refresh token which we will be convering in the next video
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            }),
            // the life span of the token needs to be shorter and utilise refresh token to keep the user signedin
            // but since this is a demo app we can extend it to fit our current need
            Expires = DateTime.UtcNow.AddHours(6),
            Audience = audience,
            Issuer = issuer,
            // here we are adding the encryption alogorithim information which will be used to decrypt our token
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
        };

        var token = jwtTokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = jwtTokenHandler.WriteToken(token);
        return jwtToken;
    }
}