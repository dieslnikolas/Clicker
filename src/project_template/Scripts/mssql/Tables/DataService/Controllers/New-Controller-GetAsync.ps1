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
Add-Line('    using Services.Common;')
Add-Line('    using DataServiceBase;')
Add-Line('    using Microsoft.AspNetCore.Http;')
Add-Line('    using Microsoft.AspNetCore.Mvc;')
Add-Line('    using Models.{0};' -f $data.Metadata.Name)
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Controller for {1}' -f $data.Metadata.Name, $lowerName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Controller : BaseApiController' -f $data.Metadata.Name)
Add-Line('    {')

# Get
Add-Line('        /// <summary>')
Add-Line('        /// Get {2} with params' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// </summary>')
Add-Line('        [HttpPost]')
Add-Line('        [ProducesResponseType(typeof(IEnumerable<{0}ListModel>), StatusCodes.Status200OK)]' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        [Route("Get")]')
Add-Line('        public async Task<IActionResult> GetAsync([FromBody] Dictionary<string, object> moduleFilter)')
Add-Line('        {')
Add-Line('            var result = await {1}Service.GetAsync(new ModuleFilter(moduleFilter));' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            return Ok(result);')
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder