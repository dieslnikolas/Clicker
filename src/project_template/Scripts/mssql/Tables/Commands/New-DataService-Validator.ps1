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

## validatorPath
$validatorPath = Join-Path -Path $path -ChildPath $('{0}/Validators/' -f  $data.Metadata.DataServiceNamespace, $table)
New-Item -ItemType Directory -Force -Path $validatorPath

## service
$filepath = Join-Path -Path $validatorPath -ChildPath $('{0}UserRestrictionValidator.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Validators\New-Validator.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## ReadMe
$filepath = Join-Path -Path $validatorPath -ChildPath $('Readme.md' -f $table)
.\Scripts\mssql\Tables\DataService\ReadMe\New-Validator-ReadMe.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data