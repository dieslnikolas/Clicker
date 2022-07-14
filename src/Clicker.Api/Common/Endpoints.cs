using System;
using System.Linq;
using Clicker.Api.Endpoints;

namespace Clicker.Api.Common
{
    public class Endpoints
    {
        private Endpoints() { }

        /// <summary>
        /// Register all implementations of IEndpoint
        /// </summary>
        /// <param name="app"></param>
        /// <exception cref="NotImplementedException"></exception>
        public static void Register(WebApplication app)
        {
            var endpoints = app.Services.GetServices<IEndpoint>();
            foreach(var endp in endpoints)
            {
                endp.Register(app);
            }
        }
    }
}

