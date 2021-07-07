using System;

namespace Clicker.Api.Models
{
    /// <summary>
    /// Server model
    /// </summary>
    public class ServerModel
    {
        /// <summary>
        /// Name of the server
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// IP
        /// </summary>
        public string IP { get; set; }

        /// <summary>
        /// Logged user
        /// </summary>
        public string User { get; set; }
    }
}
