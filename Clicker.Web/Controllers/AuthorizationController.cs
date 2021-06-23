using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clicker.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Clicker.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthorizationController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<AuthorizationController> _logger;

        public AuthorizationController(ILogger<AuthorizationController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Return informations about server
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<AuthorizationModel> Login()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new AuthorizationModel
            {
                User = "dieslnikolas",
                Password = "abcdef",
                Server = "dieslnikolas.cz"
            })
            .ToArray();
        }
    }
}
