param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

Add-Line('')

Add-Line('# Jak na registraci modelů')
Add-Line('Funkce "dataService models" vygeneruje modely k dané tabulce.')
Add-Line('Následně je potřeba doplnit mapování.')
Add-Line('')

Add-Line('## MappingProfile.cs')
Add-Line('')
Add-Line('Mapování se doplní do souboru v rootu projektu.')
Add-Line('')
Add-Line('~~~')
Add-Line('        CreateMap<Input{0}Model, {0}>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        CreateMap<{0}, Output{0}Model>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        CreateMap<{0}List, {0}ListModel>();' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('~~~')

Add-Line('## Předklady')
Add-Line('')
Add-Line('V projektu IT2021 > IT2021.Localization je soubor "LocalizationResource.xaml a do něj je potřeba doplnit překlady:')
Add-Line('~~~')
foreach ($column in $data.Columns.GetEnumerator())
{  
    # preskakuju sloupce z AuditableContext.Entity & PK
    if ($column.Value.Name -in ('CreatedBy', 'Created', 'ChangedBy', 'Changed', 'Deleted') -or $column.Value.IsPK -eq $true) {
        continue;
    }

    # primarni klic
    if ($column.Value.IsPK -eq $true) {

    }
     # Common sloupce
    elseif ($column.Value.Name -in ('Deleted')) {
        #Add-Line('        [GeisLocalizationKey("{0}.DataLayer.Entities.Common.{2}")]' -f $data.Metadata.Solution, $data.Metadata.Name, $column.Value.Name)
    }
    elseif ($column.Value.IsFK -eq $true) {
        Add-Line('  <s:String x:Key="{0}.CodelistDataLayer.Entities.{1}.{1}">---</s:String>' -f $data.Metadata.Solution, $column.Value.TableName, $column.Value.Name) 
    } else {
        Add-Line('  <s:String x:Key="{0}.Entities.{1}.{2}">---</s:String>' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Name, $column.Value.Name)
    }
}
Add-Line('~~~')

Add-Line('')
# vypisu builder do hostu
Out-Builder
