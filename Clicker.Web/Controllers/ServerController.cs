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
    public class ServerController : ControllerBase
    {

        private readonly ILogger<ServerController> _logger;

        public ServerController(ILogger<ServerController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Return informations about server
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<ServerModel> Detail()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new ServerModel
            {
                DisplayName = "Dieslnikolas.cz",
                IP = "192.168.0.1",
                User = "User"
            })
            .ToArray();
        }

        /// <summary>
        /// Restarts server
        /// </summary>
        [HttpGet]
        public void Restart()
        {

        }
    }
}
