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

# Validate
Add-Line('        /// <summary>')
Add-Line('        /// Validate {1} model according <see cref="ValidationType"/> type' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// </summary>')
Add-Line('        /// <param name="{1}Id">{1}Id</param>' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// <param name="inputModel">{1} model</param>' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// <param name="validationType">validation type</param>')
Add-Line('        [HttpPost]')
Add-Line('        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]')
Add-Line('        [Route("Validate")]')
Add-Line('        public async Task<IActionResult> ValidateAsync([FromBody] Input{0}ModuleModel inputModel, ValidationType validationType, Guid? {1}Id = null)'  -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            if (!ModelState.IsValid)')
Add-Line('            {')
Add-Line('                throw new ApiException("Invalid Model", (int)HttpStatusCode.BadRequest, ModelState.AllErrors(), "ApiError.InvalidModel");')
Add-Line('            }')
Add-Line('')
Add-Line('            if (validationType == ValidationType.Warning)')
Add-Line('            {')
Add-Line('                await {1}Service.CheckWarningsAsync({1}Id, inputModel);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('')
Add-Line('            return Ok();')
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder