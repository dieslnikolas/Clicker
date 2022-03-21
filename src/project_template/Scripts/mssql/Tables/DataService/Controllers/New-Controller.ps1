param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

$lowerName = [Regex]::Replace($data.Metadata.Name , '\b.', {  $args[0].Value.Tolower() })
$lowerPluralName = [Regex]::Replace($data.Metadata.PluralName , '\b.', {  $args[0].Value.Tolower() })

# hlavicka
Add-Line('namespace {0}.Controllers' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')

# usingy
Add-Line('    using DataServiceBase;')
Add-Line('    using LoggerFactory;')
Add-Line('    using Microsoft.AspNetCore.Authorization;')
Add-Line('    using Microsoft.AspNetCore.Mvc;')
Add-Line('    using Services;')
Add-Line('    using System;')
Add-Line('')


Add-Line('    /// <summary>')
Add-Line('    /// Controller for {1}' -f $data.Metadata.Name, $lowerName)
Add-Line('    /// </summary>')
Add-Line('    [Authorize]')
Add-Line('    [Route("/api/[Controller]/")]')
Add-Line('    public partial class {0}Controller : BaseApiController' -f $data.Metadata.Name)
Add-Line('    {')

# Constructor 
Add-Line('        private readonly I{0}Service {1}Service;' -f $data.Metadata.Name, $lowerName)
Add-Line('')
Add-Line('        /// <summary>')
Add-Line('        /// Constructor')
Add-Line('        /// </summary>')
Add-Line('        public {0}Controller(INLoggerFactory loggerFactory, I{0}Service {1}Service)' -f $data.Metadata.Name, $lowerName)
Add-Line('            : base(loggerFactory)')
Add-Line('        {')
Add-Line('            this.{1}Service = {1}Service ?? throw new ArgumentNullException(nameof({1}Service));' -f $data.Metadata.Name, $lowerName)
Add-Line('        }')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder