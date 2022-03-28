param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

.\Scripts\MsSQL\Procedures\Generator\New-Data-Generator.ps1 $data

$path = $data.Metadata.Path
if ($null -eq $path){
    $path = $env:temp
} else {
    New-Item -ItemType Directory -Force -Path $path
}

$obj = $data.TempData[$data.TempData.Keys[0]]
foreach ($pair in $data.Metadata.GetEnumerator()) {
    $obj.Metadata.Add($pair.Key, $pair.Value)  
}

$path = Join-Path -Path $path -ChildPath $('{0}/Services{1}{2}/{3}' -f  $data.Metadata.AppCoreName, ('/',('/{0}/'-f $obj.Metadata.Modules))[![string]::IsNullOrEmpty($obj.Metadata.Modules)], $obj.Metadata.PluralName, $obj.Metadata.Prefix )
New-Item -ItemType Directory -Force -Path $path

## input model
$filepath = Join-Path -Path $path -ChildPath $('InputModel.cs')
.\Scripts\MsSQL\Procedures\Mvc\Core\Common\New-Input-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## output model
$filepath = Join-Path -Path $path -ChildPath $('OutputModel.cs' -f $NameWithoutUnderscore, $obj.Metadata.Prefix, $obj.Metadata)
.\Scripts\MsSQL\Procedures\Mvc\Core\Common\New-Output-Model.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## IService
$filepath = Join-Path -Path $path -ChildPath $('IService.cs' -f $NameWithoutUnderscore, $obj.Metadata.Prefix, $obj.Metadata)
.\Scripts\MsSQL\Procedures\Mvc\Core\Services\New-Service-Interface.ps1 $obj | Out-File $filepath

# and run 
Start-EditorProcess $filepath

## Service
$filepath = Join-Path -Path $path -ChildPath $('Service.cs' -f $NameWithoutUnderscore, $obj.Metadata.Prefix, $obj.Metadata)
.\Scripts\MsSQL\Procedures\Mvc\Core\Services\New-Service.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data
