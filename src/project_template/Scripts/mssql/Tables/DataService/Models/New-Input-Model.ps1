param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Models.{2}.Input' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    /// <summary>')
Add-Line('    /// <see cref="Input{1}{0}Model"/>' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    /// </summary>')
Add-Line('    public class Input{1}{0}Model : Base{0}Model' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')


# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
