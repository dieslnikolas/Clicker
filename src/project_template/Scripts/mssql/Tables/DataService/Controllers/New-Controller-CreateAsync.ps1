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
Add-Line('    using ApiFoundations.Wrappers;')
Add-Line('    using DataServiceBase;')
Add-Line('    using Microsoft.AspNetCore.Http;')
Add-Line('    using Microsoft.AspNetCore.Mvc;')
Add-Line('    using Models.{0}.Input;' -f $data.Metadata.Name)
Add-Line('    using ResponseHandling.Extensions;')
Add-Line('    using System;')
Add-Line('    using System.Net;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Controller for {1}' -f $data.Metadata.Name, $lowerName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Controller : BaseApiController' -f $data.Metadata.Name)
Add-Line('    {')

# Create      
Add-Line('        /// <summary>')
Add-Line('        /// Create the {1}' -f $data.Metadata.Name, $lowerName)
Add-Line('        /// </summary>')
Add-Line('        [HttpPost]')
Add-Line('        [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]')
Add-Line('        [Route("Create")]')
Add-Line('        public async Task<IActionResult> CreateAsync([FromBody] Input{0}ModuleModel {1}Model)' -f $data.Metadata.Name, $lowerName)
Add-Line('        {')
Add-Line('            if (!ModelState.IsValid)')
Add-Line('            {')
Add-Line('                throw new ApiException("Invalid Model", (int)HttpStatusCode.BadRequest, ModelState.AllErrors(), "ApiError.InvalidModel");')
Add-Line('            }')
Add-Line('')
Add-Line('            var result = await {1}Service.CreateAsync({1}Model);' -f $data.Metadata.Name, $lowerName)
Add-Line('            return Ok(result);')
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder