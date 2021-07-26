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

$path = Join-Path -Path $path -ChildPath $('{0}/Controllers{1}{2}/History' -f  $data.Metadata.AppProjectName, ('/',('/{0}/'-f $obj.Metadata.Modules))[![string]::IsNullOrEmpty($obj.Metadata.Modules)], $obj.Metadata.PluralName, $obj.Metadata.Prefix)
New-Item -ItemType Directory -Force -Path $path | Out-Null

# Write-Host $obj.Metadata.OperationType

## Controller
$filepath = Join-Path -Path $path -ChildPath $('History{0}Controller.cs' -f $obj.Metadata.Name, $obj.Metadata.Prefix, $obj.Metadata)
.\Scripts\MsSQL\Procedures\Mvc\Web\Controller\New-Controller-History.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

$data
