param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Entities.Procedures' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.PluralName)

Add-Line('{')

# usingy
Add-Line('    using AuditableContext;')
Add-Line('    using System;')
Add-Line('    using System.ComponentModel.DataAnnotations;')
Add-Line('    using System.ComponentModel.DataAnnotations.Schema;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Entity for {1}{0}List procedure' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    /// </summary>')
Add-Line('    [Table("{1}{0}List")]' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    public class {1}{0}List : Entity' -f $data.Metadata.Name, $data.Metadata.Prefix)
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

    #Add-Line('        /// <summary>')
    #Add-Line('        /// {0}' -f $column.Value.Description)
    #Add-Line('        /// </summary>')

    # properta
     # primarni klic
    if ($column.Value.IsPK -eq $true) {
        Add-Line('        [Key]')
    }
    Add-Line('        public {0} {1} {{ get; set; }}' -f $type, $column.Value.Name)
    Add-Line('')
}

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
