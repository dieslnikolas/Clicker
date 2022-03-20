param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.ModuleIncludes' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    /// <summary>')
Add-Line('    /// Enum of groups collection to include in output model' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    /// </summary>')
Add-Line('    public enum {1}{0}ModuleInclude' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')


# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
