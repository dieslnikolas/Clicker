param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

.\Scripts\MsSQL\Tables\Generator\New-Data-Generator.ps1 $data

$path = $data.Metadata.Path
if ($path -eq $null){
    $path = $env:temp
} else {
    New-Item -ItemType Directory -Force -Path $path | Out-Null
}

$obj = $data.TempData[$data.TempData.Keys[0]]
$obj.ProcessItem.add([string]$data.ProcessItem.Keys[0], $data.ProcessItem[$data.ProcessItem.Keys[0]])

$obj.Metadata.Solution = $data.Metadata.Solution
$obj.Metadata.ProjectName = $data.Metadata.ProjectName
$obj.Metadata.AppNamespace = $data.Metadata.AppNamespace
$obj.Metadata.DataServiceNamespace = $data.Metadata.DataServiceNamespace
$obj.Metadata.DataLayerNamespace = $data.Metadata.DataLayerNamespace
$obj.Metadata.ContextNamespace = $data.Metadata.ContextNamespace
$obj.Metadata.UseGenerated = $data.Metadata.UseGenerated

$table = ($data.ProcessItem.GetEnumerator() | select -first 1).Value["Name"]

## baseModelpath
$baseModelpath = Join-Path -Path $path -ChildPath $('{2}/{0}/ViewModels/{1}/' -f  $data.Metadata.AppNamespace, $table, $data.Metadata.Solution)
New-Item -ItemType Directory -Force -Path $baseModelpath

## ListViewModel
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}ListViewModel.cs' -f $table)
.\Scripts\mssql\Tables\WPF\ViewModels\New-List-ViewModel.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## ListViewModel Interface
$filepath = Join-Path -Path $baseModelpath -ChildPath $('I{0}ListViewModel.cs' -f $table)
.\Scripts\mssql\Tables\WPF\ViewModels\New-List-ViewModel-Interface.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## ListParentViewModel 
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}ListParentDetailViewModel.cs' -f $table)
.\Scripts\mssql\Tables\WPF\ViewModels\New-List-Parent-ViewModel.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## Filter
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}Filter.cs' -f $table)
.\Scripts\mssql\Tables\WPF\Models\New-Filter-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## ReadMe
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}ReadMe.md' -f $table)
.\Scripts\mssql\Tables\WPF\ReadMe\New-List-ViewModel-ReadMe.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data