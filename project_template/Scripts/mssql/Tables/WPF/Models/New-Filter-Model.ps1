param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

$allowedColumns = @('Code','Name', 'Deleted') # sloupce nejsou FK, ale typicky byvaji ve filtrech

# hlavicka
Add-Line('namespace {0}.ViewModels.{2}' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    using Codelists;')
Add-Line('    using Geis.Annotations;')
Add-Line('    using IT2021.CommonLogic;')
Add-Line('    using System;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Filter model for {0}' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    /// </summary>')
Add-Line('    public class {0}Filter' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

#sloupce
foreach ($column in $data.Columns.GetEnumerator())
{  
    # preskoc vsechny mimo allowed a cizich klicu
    if ($column.Value.Name -notin $allowedColumns -and $column.Value.IsFK -ne $true) {
        continue;
    }

    # primarni klic
    if ($column.Value.IsPK -eq $true) {

    }
     # Common sloupce
    elseif ($column.Value.Name -in ('Deleted')) {
        Add-Line('        [GeisLocalizationKey("{0}.DataLayer.Entities.Common.{2}")]' -f $data.Metadata.Solution, $data.Metadata.Name, $column.Value.Name)
    }
    elseif ($column.Value.IsFK -eq $true) {
        Add-Line('        [GeisLocalizationKey("{0}.CodelistDataLayer.Entities.{1}.{1}")]' -f $data.Metadata.Solution, $column.Value.TableName, $column.Value.Name) 
        # Add-Line('        [GeisCodelist(CodelistNames.{1})]' -f $data.Metadata.DataLayerNamespace, $column.Value.TableName, $column.Value.Name) 
    } else {
        Add-Line('        [GeisLocalizationKey("{0}.Entities.{1}.{2}")]' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Name, $column.Value.Name)
    }

    # ignorace nekterych sloupcu
    if ($column.Value.Name -in $allowedColumns) {
    }
    # primarni klic
    elseif ($column.Value.IsPK -eq $true) {

    }
    # povinny polozky 
    elseif ($column.Value.IsRequired -eq $true) {
        # Add-Line('        [GeisValidation]')
    }

    $type = '{0}{1}' -f $column.Value.Type, ('','?')[$column.Value.Type -notlike 'string']

    #Add-Line('        /// <summary>')
    #Add-Line('        /// {0}' -f $column.Value.Description)
    #Add-Line('        /// </summary>')

    # properta
    Add-Line('        public {0} {1} {{ get; set; }}' -f $type, $column.Value.Name)

    if ($column.Value.Name -like 'Deleted') {
        Remove-LastChar
        Remove-LastChar
        Add-Line(' = false; //default filter value se to false')
    }

    Add-Line('')
}

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
