param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

$lowerName = [Regex]::Replace($data.Metadata.Name , '\b.', {  $args[0].Value.Tolower() })
$lowerPluralName = [Regex]::Replace($data.Metadata.PluralName , '\b.', {  $args[0].Value.Tolower() })

# hlavicka
Add-Line('<controls:ValidationUserControl x:Class="{0}.Views.{2}.{2}DetailView_BaseInfo"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('                              xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"')
Add-Line('                              xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"')
Add-Line('                              xmlns:apiclient="clr-namespace:{0}.ApiClient.Advanced;assembly={0}.ApiClient.Advanced"' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Solution)
Add-Line('                              xmlns:common="clr-namespace:{0}.Common;assembly={0}.Common"' -f $data.Metadata.Solution)
Add-Line('                              xmlns:controls="clr-namespace:{0}.Controls"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('                              xmlns:d="http://schemas.microsoft.com/expression/blend/2008"')
Add-Line('                              xmlns:{3}="clr-namespace:{0}.ViewModels.{2}"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('                              xmlns:dxlc="http://schemas.devexpress.com/winfx/2008/xaml/layoutcontrol"')
Add-Line('                              xmlns:dxmvvm="http://schemas.devexpress.com/winfx/2008/xaml/mvvm"')
Add-Line('                              xmlns:dxr="http://schemas.devexpress.com/winfx/2008/xaml/ribbon"')
Add-Line('                              xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"')
Add-Line('                              xmlns:views="clr-namespace:{0}.Views"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('                              xmlns:vm="clr-namespace:{0}.ViewModels.{2}"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('                              d:DataContext="{{d:DesignInstance Type=vm:{0}DetailViewModel}}"' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('                              d:DesignHeight="400"')
Add-Line('                              d:DesignWidth="{StaticResource {x:Static common:ResourceKeySelector.MinDocumentWidth}}"')
Add-Line('                              mc:Ignorable="d">')

# telo
Add-Line('  <controls:LayoutGroupExtended>')
Add-Line('    <controls:LayoutGroupExtended dxlc:LayoutControl.AllowVerticalSizing="True" Orientation="Vertical">')


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
        Add-Line('        // [GeisLocalizationKey("{0}.DataLayer.Entities.Common.{2}")]' -f $data.Metadata.Solution, $data.Metadata.Name, $column.Value.Name)
    }
    elseif ($column.Value.IsFK -eq $true) {
        Add-Line('        // [GeisLocalizationKey("{0}.CodelistDataLayer.Entities.{1}.{1}")]' -f $data.Metadata.Solution, $column.Value.TableName, $column.Value.Name) 
        # Add-Line('        [GeisCodelist(CodelistNames.{1})]' -f $data.Metadata.DataLayerNamespace, $column.Value.TableName, $column.Value.Name) 
    } else {
        Add-Line('        // [GeisLocalizationKey("{0}.Entities.{1}.{2}")]' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Name, $column.Value.Name)
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
    Add-Line('        // public {0} {1} {{ get; set; }}' -f $type, $column.Value.Name)

    if ($column.Value.Name -like 'Deleted') {
        Remove-LastChar
        Remove-LastChar
        Add-Line(' = false; //default filter value se to false')
    }

    Add-Line('')
}


# TODO repec polozek
Add-Line('      <dxlc:LayoutItem>')
Add-Line('        <controls:LocalizedLabelControl LabelSourceProperty="Name" LabelSourceType="{{x:Type apiclient:Output{2}Model}}" ShowInHistory="True">' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('          <controls:TextEditExtended DirtyPropertyPath="Model.{2}.Dirty[Name]" EditValue="{{Binding Model.{2}.Name, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged, NotifyOnValidationError=True, ValidatesOnDataErrors=True}}" />'  -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('        </controls:LocalizedLabelControl>')
Add-Line('      </dxlc:LayoutItem>')
Add-Line('    </controls:LayoutGroupExtended>')

Add-Line('  </controls:LayoutGroupExtended>')
Add-Line('</controls:ValidationUserControl>')

# vypisu builder do hostu
Out-Builder
