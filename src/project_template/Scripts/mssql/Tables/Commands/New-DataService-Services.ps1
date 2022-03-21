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

## serviceModelpath
$serviceModelpath = Join-Path -Path $path -ChildPath $('{0}/Services/{1}' -f  $data.Metadata.DataServiceNamespace, $table)
New-Item -ItemType Directory -Force -Path $serviceModelpath

## service
$filepath = Join-Path -Path $serviceModelpath -ChildPath $('{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-Base.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## interface
$filepath = Join-Path -Path $serviceModelpath -ChildPath $('I{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-Base-Interface.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## ReadMe
$filepath = Join-Path -Path $serviceModelpath -ChildPath $('Readme.md' -f $table)
.\Scripts\mssql\Tables\DataService\ReadMe\New-Service-ReadMe.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## CreateAsync
$filepathDirectory = Join-Path -Path $serviceModelpath -ChildPath $('/Create/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Create{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-CreateAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## CreateAsync Interface
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('ICreate{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-CreateAsync-Interface.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## DeleteAsync
$filepathDirectory = Join-Path -Path $serviceModelpath -ChildPath $('/Delete/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Delete{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-DeleteAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## DeleteAsync Interface
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('IDelete{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-DeleteAsync-Interface.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetAsync
$filepathDirectory = Join-Path -Path $serviceModelpath -ChildPath $('/Get/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('IGet{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-GetAsync-Interface.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetAsync Interface
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Get{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-GetAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetHistory
$filepathDirectory = Join-Path -Path $serviceModelpath -ChildPath $('/GetHistory/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('IGetHistory{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-GetHistoryAsync-Interface.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetHistory Interface
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('GetHistory{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-GetHistoryAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetByIdAsync
$filepathDirectory = Join-Path -Path $serviceModelpath -ChildPath $('/GetById/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('GetById{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-GetByIdAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## GetByIdAsync Interface
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('IGetById{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-GetByIdAsync-Interface.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## UpdateAsync
$filepathDirectory = Join-Path -Path $serviceModelpath -ChildPath $('/Update/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Update{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-UpdateAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## UpdateAsync Interface
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('IUpdate{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-UpdateAsync-Interface.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## ValidateAsync
$filepathDirectory = Join-Path -Path $serviceModelpath -ChildPath $('/Validate/')
New-Item -ItemType Directory -Force -Path $filepathDirectory
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('Validate{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-ValidateAsync.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

## ValidateAsync Interface
$filepath = Join-Path -Path $filepathDirectory -ChildPath $('IValidate{0}Service.cs' -f $table)
.\Scripts\mssql\Tables\DataService\Services\New-Service-ValidateAsync-Interface.ps1 $obj | Out-File $filepath
# and run
Start-EditorProcess $filepath

$data