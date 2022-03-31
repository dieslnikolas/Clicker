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

$path = Join-Path -Path $path -ChildPath $('{0}/Controllers{1}{2}/{3}' -f  $data.Metadata.AppProjectName, ('/',('/{0}/'-f $obj.Metadata.Modules))[![string]::IsNullOrEmpty($obj.Metadata.Modules)], $obj.Metadata.PluralName, $obj.Metadata.Prefix)
New-Item -ItemType Directory -Force -Path $path | Out-Null

## Controller
$filepath = Join-Path -Path $path -ChildPath $('Controller.cs') #$('{1}{0}Controller.cs' -f $obj.Metadata.Name, $obj.Metadata.Prefix, $obj.Metadata)
.\Scripts\MsSQL\Procedures\Mvc\Web\Controller\New-Controller.ps1 $obj | Out-File $filepath

# and run
Start-EditorProcess $filepath

## Models
if ($obj.Metadata.OperationType -eq 'ALL') {
    # filter
    $filepath = Join-Path -Path $path -ChildPath $('FilterModel.cs') #$('{1}{0}FilterModel.cs' -f $obj.Metadata.Name, $obj.Metadata.Prefix, $obj.Metadata)
    .\Scripts\MsSQL\Procedures\Mvc\Web\Model\New-Filter-Model.ps1 $obj | Out-File $filepath

    #Model
    $filepath = Join-Path -Path $path -ChildPath $('Model.cs') #$('{1}{0}Model.cs' -f $obj.Metadata.Name, $obj.Metadata.Prefix, $obj.Metadata)
    .\Scripts\MsSQL\Procedures\Mvc\Web\Model\New-List-Model.ps1 $obj | Out-File $filepath

    #itemModel
    $filepath = Join-Path -Path $path -ChildPath $('ItemModel.cs') #$('{1}{0}ItemModel.cs' -f $obj.Metadata.Name, $obj.Metadata.Prefix, $obj.Metadata)
    .\Scripts\MsSQL\Procedures\Mvc\Web\Model\New-List-Item-Model.ps1 $obj | Out-File $filepath
} else {
    #Model
    $filepath = Join-Path -Path $path -ChildPath $('Model.cs') #$('{1}{0}Model.cs' -f $obj.Metadata.Name, $obj.Metadata.Prefix, $obj.Metadata)
   .\Scripts\MsSQL\Procedures\Mvc\Web\Model\New-Model.ps1 $obj | Out-File $filepath
}

# and run
Start-EditorProcess $filepath

## Handler
$filepath = Join-Path -Path $path -ChildPath $('Handler.cs') #$('{1}{0}Handler.cs' -f $obj.Metadata.Name, $obj.Metadata.Prefix, $obj.Metadata)
if ($obj.Metadata.OperationType -in ('NEW', 'EDIT')) {
    .\Scripts\MsSQL\Procedures\Mvc\Web\Handler\New-Create-Handler.ps1 $obj | Out-File $filepath
} elseif ($obj.Metadata.OperationType -in ('DEL')) {
    .\Scripts\MsSQL\Procedures\Mvc\Web\Handler\New-Del-Handler.ps1 $obj | Out-File $filepath
}

# and run
Start-EditorProcess $filepath

$data
