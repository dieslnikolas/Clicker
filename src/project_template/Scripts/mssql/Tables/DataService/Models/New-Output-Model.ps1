param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Models.{2}.Output' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')

# usingy
Add-Line('    using Geis.Annotations;')
Add-Line('    using System;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// <see cref="Output{1}{0}Model"/>' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    /// </summary>')
Add-Line('    public class Output{1}{0}Model : Base{0}Model' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

#sloupce
foreach ($column in $data.Columns.GetEnumerator())
{  
    # Pouze ID!
    if ($column.Value.IsPK -ne $true) {
        continue;
    }

    if ($column.Value.IsFK -eq $true) {
        Add-Line('        [GeisLocalizationKey("{0}.Entities.{1}.{1}")]' -f $data.Metadata.DataLayerNamespace, $column.Value.TableName, $column.Value.Name) 
        Add-Line('        [GeisCodelist(CodelistNames.{1})]' -f $data.Metadata.DataLayerNamespace, $column.Value.TableName, $column.Value.Name) 
    } else {
        Add-Line('        [GeisLocalizationKey("{0}.Entities.{1}.{2}")]' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Name, $column.Value.Name)
    }

    # primarni klic
    if ($column.Value.IsPK -eq $true) {
        Add-Line('        [GeisModelKey]')
    }
    # povinny polozky 
    elseif ($column.Value.IsRequired -eq $true) {
        Add-Line('        [GeisValidation]')
    }

    $type = '{0}{1}' -f $column.Value.Type, ('','?')[$column.Value.IsNullable -eq $true]

    #Add-Line('        /// <summary>')
    #Add-Line('        /// {0}' -f $column.Value.Description)
    #Add-Line('        /// </summary>')

    # properta
    Add-Line('        public {0} {1} {{ get; set; }}' -f $type, $column.Value.Name)
    Add-Line('')
}

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
