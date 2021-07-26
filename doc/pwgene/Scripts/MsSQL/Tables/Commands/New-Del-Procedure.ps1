param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

$table = ($data.ProcessItem.GetEnumerator() | select -first 1).Value["Name"]

$Name = $table + "_DEL"
$Command = 'CREATE'
$CreateCommand = $false
$procedureName = "SF_Procedure_GenerateDel"
$suffix = $null

$output = .\Scripts\MsSQL\Tables\Generators\Generate-Procedure.ps1 -suffix $suffix -table $table -procedureName $procedureName -name $name

if ($output -ne '') {
    # save definition to temp
    $path = Join-Path -Path $env:temp -ChildPath "$($Name).sql"
    $output | Out-File -filepath $path
    # and run
    Start-Process -filepath $path
}

$data