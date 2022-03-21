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

$obj.Metadata.ProjectName = $data.Metadata.ProjectName
$obj.Metadata.DataServiceNamespace = $data.Metadata.DataServiceNamespace
$obj.Metadata.DataLayerNamespace = $data.Metadata.DataLayerNamespace
$obj.Metadata.ContextNamespace = $data.Metadata.ContextNamespace
$obj.Metadata.UseGenerated = $data.Metadata.UseGenerated

$table = ($data.ProcessItem.GetEnumerator() | select -first 1).Value["Name"]

## proc
$procpath = Join-Path -Path $path -ChildPath $('{0}/Database/Procedures/' -f  $data.Metadata.DataLayerNamespace)
New-Item -ItemType Directory -Force -Path $procpath

$filepath = Join-Path -Path $procpath -ChildPath $('{0}List001.sql' -f $table)
.\Scripts\mssql\Tables\DataLayer\Database\New-List-Procedure.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## entita
$entitypath = Join-Path -Path $path -ChildPath $('{0}/Entities/Procedures/' -f  $data.Metadata.DataLayerNamespace)
New-Item -ItemType Directory -Force -Path $entitypath

$filepath = Join-Path -Path $entitypath -ChildPath $('{0}List.cs' -f $table)
.\Scripts\mssql\Tables\DataLayer\Entities\New-List-Procedure-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## ReadMe
$readmePath = Join-Path -Path $path -ChildPath $('{0}/Database/' -f  $data.Metadata.DataLayerNamespace)
New-Item -ItemType Directory -Force -Path $entitypath

$filepath = Join-Path -Path $readmePath -ChildPath $('{0}ListReadme.md' -f $table)
.\Scripts\mssql\Tables\DataLayer\Readme\New-List-Readme.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data