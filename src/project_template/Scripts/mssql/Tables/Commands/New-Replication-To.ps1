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
$baseModelpath = Join-Path -Path $path -ChildPath $('{0}/Entities/ReplEntities' -f  $data.Metadata.DataLayerNamespace, $table)
New-Item -ItemType Directory -Force -Path $baseModelpath

## ReadMe
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}ReadMe.md' -f $table)
.\Scripts\mssql\Tables\DataService\ReadMe\New-Replication-To-ReadMe.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## Model
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Replication\New-Replication-To.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data