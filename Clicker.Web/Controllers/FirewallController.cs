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
    public class FirewallController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<FirewallController> _logger;

        public FirewallController(ILogger<FirewallController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Return informations about server
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<RuleModel> GetRules()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new RuleModel
            {
                DisplayName = "Dieslnikolas.cz",
                Port = "80",
                IpAddresses = new List<string>() { "192.168.0.1", "127.0.0.1" },
                IsRestriction = true,
                IsEnabled = true
            })
            .ToArray();
        }

        [HttpPost]
        public void Edit(RuleModel model) { }
    }
}
