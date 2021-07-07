using System;

namespace Clicker.Api.Models
{
    /// <summary>
    /// Binding model represents one website 
    /// </summary>
    public class BindingModel
    {
        /// <summary>
        /// Name of the website
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// DNS
        /// </summary>
        public string DNS { get; set; }

        /// <summary>
        /// State of the website
        /// </summary>
        public string State { get; set; }
    }
}
