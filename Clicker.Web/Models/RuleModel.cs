using System;
using System.Collections;
using System.Collections.Generic;

namespace Clicker.Web.Models
{
    /// <summary>
    /// Represents one rule for firewall
    /// </summary>
    public class RuleModel
    {
        /// <summary>
        /// Model
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Rule
        /// </summary>
        public string Port { get; set; }

        /// <summary>
        /// List of allowed IP addresses
        /// </summary>
        public IList<string> IpAddresses { get; set; }

        /// <summary>
        /// If rule is enabled
        /// </summary>
        public bool IsEnabled { get; set; }

        /// <summary>
        /// If it is restriction then its not allowing connection
        /// If it is not restriction thent its allowing connection
        /// </summary>
        public bool IsRestriction { get; set; }
    }
}
