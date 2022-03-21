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

## controllerPath
$controllerPath = Join-Path -Path $path -ChildPath $('{0}/Controllers/{1}/' -f  $data.Metadata.DataServiceNamespace, $table)
New-Item -ItemType Directory -Force -Path $controllerPath

## root
$filepath = Join-Path -Path $controllerPath -ChildPath $('{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## CreateAsync
$filepathDirectory = Join-Path -Path $controllerPath -ChildPath $('/Create/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Create{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller-CreateAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## DeleteAsync
$filepathDirectory = Join-Path -Path $controllerPath -ChildPath $('/Delete/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Delete{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller-DeleteAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetAsync
$filepathDirectory = Join-Path -Path $controllerPath -ChildPath $('/Get/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Get{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller-GetAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetByIdAsync
$filepathDirectory = Join-Path -Path $controllerPath -ChildPath $('/GetById/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('GetById{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller-GetByIdAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetHistory
$filepathDirectory = Join-Path -Path $controllerPath -ChildPath $('/GetHistory/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('GetHistory{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller-GetHistory.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## UpdateAsync
$filepathDirectory = Join-Path -Path $controllerPath -ChildPath $('/Update/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Update{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller-UpdateAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## ValidateAsync
$filepathDirectory = Join-Path -Path $controllerPath -ChildPath $('/Validate/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Validate{0}Controller.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Controllers\New-Controller-ValidateAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

$data