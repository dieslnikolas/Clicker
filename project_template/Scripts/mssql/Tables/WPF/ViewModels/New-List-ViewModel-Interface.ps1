param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.ViewModels.{2}' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    using System;')
Add-Line('    using System.Threading.Tasks;')

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Interface of common actions for {0}''s list' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    public interface I{1}{0}ListViewModel' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        /// <summary>')
Add-Line('        /// Searches record by primary key and open detail when found')
Add-Line('        /// </summary>')
Add-Line('        /// <param name="primaryKey">Primary key</param>')
Add-Line('        Task SearchAndOpenDetailAsync(Guid primaryKey);')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
