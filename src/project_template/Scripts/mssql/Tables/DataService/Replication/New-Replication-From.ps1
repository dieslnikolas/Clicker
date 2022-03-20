param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# Replication model

Add-Line('namespace IT2021.CodelistDataService.Models.Replication' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
# tohle by bylo správnější, ale dal jsem tam natrvrdo codelist, abych mohl praovat s pwgene jen pro sales a fungovalo mi to, musel bych otevírat druhý powergene
#Add-Line('namespace {0}.Models.Replication' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')
Add-Line('')
Add-Line('    using System;')
Add-Line('')
Add-Line('    public class Replication{0}Model : ReplicationBaseModel'  -f $data.Metadata.Name)
Add-Line('    {')
Add-Line('')
Add-Line('        public Guid {0}Id {{ get; set; }}'  -f $data.Metadata.Name)
Add-Line('')

#sloupce
foreach ($column in $data.Columns.GetEnumerator())
{  
    # preskakuju sloupce z AuditableContext.Entity & PK
    if ($column.Value.Name -in ('CreatedBy', 'Created', 'ChangedBy', 'Changed', 'Deleted') -or $column.Value.IsPK -eq $true) {
        continue;
    }

    $type = '{0}{1}' -f $column.Value.Type, ('','?')[$column.Value.IsNullable -eq $true]

    #Add-Line('        /// <summary>')
    #Add-Line('        /// {0}' -f $column.Value.Description)
    #Add-Line('        /// </summary>')

    # properta
    Add-Line('        public {0} {1} {{ get; set; }}' -f $type, $column.Value.Name)
    Add-Line('')
}

Add-Line('    }')
Add-Line('}')


# vypisu builder do hostu
Out-Builder
