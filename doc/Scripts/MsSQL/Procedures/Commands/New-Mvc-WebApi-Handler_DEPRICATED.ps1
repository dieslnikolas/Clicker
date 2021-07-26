param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

.\Scripts\MsSQL\Procedures\Generator\New-Data-Generator.ps1 $data

$path = $data.Metadata.Path
if ($path -eq $null){
    $path = $env:temp
} else {
    New-Item -ItemType Directory -Force -Path $path | Out-Null
}

$obj = $data.TempData[$data.TempData.Keys[0]]
foreach ($pair in $data.Metadata.GetEnumerator()) {
    $obj.Metadata.Add($pair.Key, $pair.Value)  
}

$path = Join-Path -Path $path -ChildPath $('{0}/Controllers{1}{2}/{3}' -f  $data.Metadata.AppWebApiProjectName, ('/',('/{0}/'-f $obj.Metadata.Modules))[![string]::IsNullOrEmpty($obj.Metadata.Modules)], $obj.Metadata.PluralName, ($obj.Metadata.PrefixType+$obj.Metadata.PrefixExtension))
New-Item -ItemType Directory -Force -Path $path | Out-Null

## Controller
$filepath = Join-Path -Path $path -ChildPath $('Controller.cs')
.\Scripts\MsSQL\Procedures\Mvc\WebApi\Controller\New-Controller.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## Handler
$filepath = Join-Path -Path $path -ChildPath $('Handler.cs')
if ($obj.Metadata.OperationType -in ('NEW', 'EDIT')) {
    .\Scripts\MsSQL\Procedures\Mvc\WebApi\Handler\New-Create-Handler.ps1 $obj | Out-File $filepath
} elseif ($obj.Metadata.OperationType -in ('DEL')) {
    .\Scripts\MsSQL\Procedures\Mvc\WebApi\Handler\New-Del-Handler.ps1 $obj | Out-File $filepath
}

# and run
Start-EditorProcess $filepath

$data
