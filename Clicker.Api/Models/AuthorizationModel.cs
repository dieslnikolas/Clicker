using System;

namespace Clicker.Api.Models
{
    /// <summary>
    /// Model for user/server authentication
    /// </summary>
    public class AuthorizationModel
    {
        /// <summary>
        /// User name
        /// </summary>
        public string User { get; set; }

        /// <summary>
        /// Password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Server
        /// </summary>
        public string Server { get; set; }
    }
}
