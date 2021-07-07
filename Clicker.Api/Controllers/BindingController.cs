using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clicker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Clicker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Binding2Controller : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<FirewallController> _logger;

        public Binding2Controller(ILogger<FirewallController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Return informations about server
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<BindingModel> GetBinding()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new BindingModel
            {
                DisplayName = "Dieslnikolas.cz",
                DNS = "192.168.0.1",
                State = "User"
            })
            .ToArray();
        }

        /// <summary>
        /// Edit the binding
        /// </summary>
        /// <param name="model"></param>
        [HttpPost]
        public void Edit(BindingModel model) { }

        /// <summary>
        /// Stop 
        /// </summary>
        /// <param name="model"></param>
        [HttpPost]
        public void Stop(BindingModel model) { }

        /// <summary>
        /// Run
        /// </summary>
        /// <param name="model"></param>
        [HttpPost]
        public void Run(BindingModel model) { }

        /// <summary>
        /// Restart binding
        /// </summary>
        /// <param name="model"></param>
        [HttpPost]
        public void Restart(BindingModel model) { }


    }
}
