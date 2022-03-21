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
$baseModelpath = Join-Path -Path $path -ChildPath $('{2}/{0}/Views/{1}/' -f  $data.Metadata.AppNamespace, $table, $data.Metadata.Solution)
New-Item -ItemType Directory -Force -Path $baseModelpath

## DetailView
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}DetailView.xaml' -f $table)
.\Scripts\mssql\Tables\WPF\Views\New-Detail-View.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## DetailView CodeBehind
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}DetailView.xaml.cs' -f $table)
.\Scripts\mssql\Tables\WPF\Views\New-Detail-View-CodeBehind.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## BaseInfo
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}DetailView_BaseInfo.xaml' -f $table)
.\Scripts\mssql\Tables\WPF\Views\New-Detail-BaseInfo-View.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## BaseInfo CodeBehind
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}DetailView_BaseInfo.xaml.cs' -f $table)
.\Scripts\mssql\Tables\WPF\Views\New-Detail-BaseInfo-View-CodeBehind.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath


## ReadMe
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}ReadMe.md' -f $table)
.\Scripts\mssql\Tables\WPF\ReadMe\New-Detail-View-ReadMe.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## resourcesPath
$resourcesPath = Join-Path -Path $path -ChildPath $('{2}/{0}/Resources/' -f  $data.Metadata.AppNamespace, $table, $data.Metadata.Solution)
New-Item -ItemType Directory -Force -Path $resourcesPath

## Resources
$filepath = Join-Path -Path $resourcesPath -ChildPath $('{0}.xaml' -f $table)
.\Scripts\mssql\Tables\WPF\Resources\New-DetailDefinition-View.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data