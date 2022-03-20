param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Models.{2}' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    using ApiClientBase.Models;')
Add-Line('    using Codelists;')
Add-Line('    using Geis.Annotations;')
Add-Line('    using System;')

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// <see cref="{0}ListModel"/>' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    public class {1}{0}ListModel : AuditableModel' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

#sloupce
foreach ($column in $data.Columns.GetEnumerator())
{  
    # preskakuju sloupce z AuditableContext.Entity
    if ($column.Value.Name -in ('CreatedBy', 'Created', 'ChangedBy', 'Changed', 'Deleted')) {
        continue;
    }

    $type = '{0}{1}' -f $column.Value.Type, ('','?')[$column.Value.IsNullable -eq $true]
    #$type = '{0}{1}' -f $column.Value.Type, ('?','')[$column.Value.Type -in ('Guid', 'string', 'bool')]

    # properta

    if ($column.Value.IsFK -eq $true) {
        Add-Line('        [GeisLocalizationKey("{0}.CodelistDataLayer.Entities.{1}.{1}")]' -f $data.Metadata.Solution, $column.Value.TableName, $column.Value.Name) 
        Add-Line('        [GeisCodelist(CodelistNames.{1})]' -f $data.Metadata.DataLayerNamespace, $column.Value.TableName, $column.Value.Name) 
    } else {
        Add-Line('        [GeisLocalizationKey("{0}.Entities.{1}.{2}")]' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Name, $column.Value.Name)
    }

     # primarni klic
    if ($column.Value.IsPK -eq $true) {
        Add-Line('        [GeisModelKey]')
    }

    Add-Line('        public {0} {1} {{ get; set; }}' -f $type, $column.Value.Name)
    Add-Line('')
}

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
