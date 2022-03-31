param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# usingy
Add-Line('using System;')
Add-Line('using System.Collections.Generic;')

Add-Line('')

# hlavicka
#Add-Line('namespace {0}.Services{1}{2}' -f $data.Metadata.CoreNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)
Add-Line('namespace {0}.Services' -f $data.Metadata.CoreNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)

Add-Line('{')

# Výstupní model

Add-Line('')
Add-Line('    public class {0}{1}OutputModel ' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata)
Add-Line('    {')

Add-Line('')
Add-Line('        /// <summary>')
Add-Line('        /// Celkový počet stránek')
Add-Line('        /// </summary>')
Add-Line('        public int TotalPages { get; set; }')

Add-Line('')
Add-Line('        /// <summary>')
Add-Line('        /// Položky')
Add-Line('        /// </summary>')
Add-Line('        public ICollection<{0}{1}OutputItemModel> Items {{ get; set; }}' -f $data.Metadata.Name, $data.Metadata.Prefix)

Add-Line('')
Add-Line('        public {0}{1}OutputModel() ' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata)
Add-Line('        {')
Add-Line('            Items = new List<{0}{1}OutputItemModel>();' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata)
Add-Line('        }')
Add-Line('    }')

#Položky

Add-Line('')
Add-Line('    /// <summary>')
Add-Line('    /// {0}' -f $data.Metadata.ProcedureDescription)
Add-Line('    /// Výstupní model entity - {0}' -f $data.Metadata.Description)
Add-Line('    /// </summary>')
Add-Line('    public class {0}{1}OutputItemModel ' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata)
Add-Line('    {')

#sloupce
foreach ($column in $data.OutputColumns.GetEnumerator())
{  
    $type = '{0}{1}' -f $column.Value.Type, ('','?')[$column.Value.IsNullable -eq $true -and $column.Value.Type -NotIn ('string')]
    #$type = '{0}{1}' -f $column.Value.Type, ('?','')[$column.Value.Type -in ('Guid', 'string', 'bool')]

    Add-Line('        /// <summary>')
    Add-Line('        /// {0}' -f $column.Value.Description)
    Add-Line('        /// </summary>')

    # properta
    # Add-Line('        [Display("{0}")]' -f $column.Value.Description)
    Add-Line('        public {0} {1} {{ get; set; }}' -f $type, $column.Value.Name)
    Add-Line('')
}

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
