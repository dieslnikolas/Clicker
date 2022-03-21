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
$obj.Metadata.DataServiceNamespace = $data.Metadata.DataServiceNamespace
$obj.Metadata.DataLayerNamespace = $data.Metadata.DataLayerNamespace
$obj.Metadata.ContextNamespace = $data.Metadata.ContextNamespace
$obj.Metadata.UseGenerated = $data.Metadata.UseGenerated

$table = ($data.ProcessItem.GetEnumerator() | select -first 1).Value["Name"]

## baseModelpath
$baseModelpath = Join-Path -Path $path -ChildPath $('{0}/Models/{1}/' -f  $data.Metadata.DataServiceNamespace, $table)
New-Item -ItemType Directory -Force -Path $baseModelpath

$filepath = Join-Path -Path $baseModelpath -ChildPath $('Base{0}Model.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Models\New-Base-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## List
$filepath = Join-Path -Path $baseModelpath -ChildPath $('{0}ListModel.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Models\New-List-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## inputInputpath
$inputInputpath = Join-Path -Path $path -ChildPath $('{0}/Models/{1}/Input' -f  $data.Metadata.DataServiceNamespace, $table)
New-Item -ItemType Directory -Force -Path $inputInputpath

$filepath = Join-Path -Path $inputInputpath -ChildPath $('Input{0}Model.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Models\New-Input-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$filepath = Join-Path -Path $inputInputpath -ChildPath $('Input{0}ModuleModel.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Models\New-Input-Module-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## outputModelpath
$outputModelpath = Join-Path -Path $path -ChildPath $('{0}/Models/{1}/Output' -f  $data.Metadata.DataServiceNamespace, $table)
New-Item -ItemType Directory -Force -Path $outputModelpath

$filepath = Join-Path -Path $outputModelpath -ChildPath $('Output{0}Model.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Models\New-Output-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$filepath = Join-Path -Path $outputModelpath -ChildPath $('Output{0}ModuleModel.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Models\New-Output-Module-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath


## moduleIncludepath
$moduleIncludepath = Join-Path -Path $path -ChildPath $('{0}/ModuleIncludes' -f  $data.Metadata.DataServiceNamespace, $table)
New-Item -ItemType Directory -Force -Path $moduleIncludepath

$filepath = Join-Path -Path $moduleIncludepath -ChildPath $('{0}ModuleInclude.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Models\New-Module-Include.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## ReadMe
## path
$readMepath = Join-Path -Path $path -ChildPath $('{0}/Models/' -f  $data.Metadata.DataServiceNamespace, $table)
$filepath = Join-Path -Path $readMepath -ChildPath $('Readme.md' -f $table)
.\Scripts\mssql\Tables\DataService\Readme\New-Models-ReadMe.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath


$data