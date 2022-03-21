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
Add-Line('    using Microsoft.AspNetCore.Http;')
Add-Line('    using Microsoft.AspNetCore.Mvc;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('    using System;')
Add-Line('')

# GetHistory
Add-Line('    /// <summary>')
Add-Line('    /// Controller for {0}' -f $data.Metadata.Name, $lowerName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Controller : BaseApiController' -f $data.Metadata.Name, $lowerName)
Add-Line('    {')
Add-Line('        /// <summary>')
Add-Line('        /// Gets history for {0}' -f $data.Metadata.Name, $lowerName)
Add-Line('        /// </summary>')
Add-Line('        /// <param name="id">Primary key</param>')
Add-Line('        /// <param name="languageId">Languages identifier</param>')
Add-Line('        /// <returns>Returns history for {1}</returns>' -f $data.Metadata.Name, $lowerName)
Add-Line('        [HttpGet]')
Add-Line('        [ProducesResponseType(typeof(IEnumerable<ApiClientBase.Models.OutputHistoryModel>), StatusCodes.Status200OK)]')
Add-Line('        [Route("GetHistory/{id}")]')
Add-Line('        public async Task<IActionResult> GetHistory(Guid id, Guid languageId)')
Add-Line('        {')
Add-Line('            var result = await {1}Service.GetHistoryAsync(id, languageId);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            return Ok(result);')
Add-Line('        }')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
