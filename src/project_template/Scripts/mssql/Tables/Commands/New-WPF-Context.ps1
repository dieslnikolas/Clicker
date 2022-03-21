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

## context path
$contextModelPath = Join-Path -Path $path -ChildPath $('{2}/{0}/Context/' -f  $data.Metadata.AppNamespace, $table, $data.Metadata.Solution)
New-Item -ItemType Directory -Force -Path $contextModelPath

## Context
$filepath = Join-Path -Path $contextModelPath -ChildPath $('{0}Context.cs' -f $table)
.\Scripts\mssql\Tables\WPF\Context\New-Context.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## contract path
$contractModelPath = Join-Path -Path $path -ChildPath $('{2}/{0}/Context/Contract' -f  $data.Metadata.AppNamespace, $table, $data.Metadata.Solution)
New-Item -ItemType Directory -Force -Path $contractModelPath

## IContext
$filepath = Join-Path -Path $contractModelPath -ChildPath $('I{0}Context.cs' -f $table)
.\Scripts\mssql\Tables\WPF\Context\New-Context-Interface.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data