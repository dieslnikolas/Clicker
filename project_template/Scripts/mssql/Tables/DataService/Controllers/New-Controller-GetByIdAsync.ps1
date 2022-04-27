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
Add-Line('    using ModuleIncludes;')
Add-Line('    using Microsoft.AspNetCore.Http;')
Add-Line('    using Microsoft.AspNetCore.Mvc;')
Add-Line('    using Models.{0}.Output;' -f $data.Metadata.Name)
Add-Line('    using System;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Controller for {1}' -f $data.Metadata.Name, $lowerName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Controller : BaseApiController' -f $data.Metadata.Name)
Add-Line('    {')

# GetById
Add-Line('        /// <summary>')
Add-Line('        /// Get {1} with includes by id' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// </summary>')
Add-Line('        [HttpGet]')
Add-Line('        [ProducesResponseType(typeof(Output{0}ModuleModel), StatusCodes.Status200OK)]' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        [Route("GetById/{id}")]')
Add-Line('        public async Task<IActionResult> GetByIdAsync(Guid id, IEnumerable<{0}ModuleInclude> includes, Guid languageId, bool isCopy = false, bool deleted = false)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            Output{0}ModuleModel result;' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            if (deleted)')
Add-Line('            {')
Add-Line('                result = await {1}Service.GetDeletedByIdAsync(id, new HashSet<{0}ModuleInclude>(includes), languageId);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('            else')
Add-Line('            {')
Add-Line('                result = await {1}Service.GetByIdAsync(id, new HashSet<{0}ModuleInclude>(includes), isCopy, languageId);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('')
Add-Line('            return Ok(result);')
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder