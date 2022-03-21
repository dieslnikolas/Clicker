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
Add-Line('    using System;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Controller for {1}' -f $data.Metadata.Name, $lowerName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Controller : BaseApiController' -f $data.Metadata.Name)
Add-Line('    {')

# Delete
Add-Line('        /// <summary>')
Add-Line('        /// Deletes the {1} by Id' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// </summary>')
Add-Line('        [HttpDelete]')
Add-Line('        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]')
Add-Line('        [Route("Delete/{id}")]')
Add-Line('        public async Task<IActionResult> DeleteAsync(Guid id)')
Add-Line('        {')
Add-Line('            await {1}Service.DeleteAsync(id);' -f $data.Metadata.Name, $lowerName)
Add-Line('            return Ok();')
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder