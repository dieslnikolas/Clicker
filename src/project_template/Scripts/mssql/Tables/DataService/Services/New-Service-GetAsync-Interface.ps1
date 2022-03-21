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
Add-Line('namespace {0}.Services' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')

# usingy
Add-Line('    using DataServiceBase.Models;')
Add-Line('    using Models.{0};' -f $data.Metadata.Name)
Add-Line('    using Models.{0}.Input;' -f $data.Metadata.Name)
Add-Line('    using Models.{0}.Output;' -f $data.Metadata.Name)
Add-Line('    using ModuleIncludes;')
Add-Line('    using System;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// {0}Service interface' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    public partial interface I{0}Service' -f $data.Metadata.Name)
Add-Line('    {')

# Get
Add-Line('        /// <summary>')
Add-Line('        /// Get list of {2}' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// </summary>')
Add-Line('        Task<IEnumerable<{0}ListModel>> GetAsync(ModuleFilter moduleFilter);' -f $data.Metadata.Name, $lowerName)
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder