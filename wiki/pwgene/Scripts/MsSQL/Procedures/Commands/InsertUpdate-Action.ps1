param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

# connString
$conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
$conn.Open()

.\Scripts\MsSQL\Procedures\Generator\New-Data-Generator.ps1 $data
$obj = $data.TempData[$data.TempData.Keys[0]]

$requiresRecord = $false
if($obj.Metadata.PrefixType -in ('All', 'New')){
    # Table
    $requiresRecord = $false
}elseif ($obj.Metadata.PrefixType -in ('Edit', 'Detail', 'Del')) {
    # Record
    $requiresRecord = $true
}

## query & cmd
$q = (Get-Content .\Scripts\MsSQL\Procedures\SQL\New-Action-Custom.sql -Encoding UTF8) -join "`n"
$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)

$cmd.Parameters.AddWithValue('@ID_Action', $obj.Metadata.ProcedureName) | Out-Null
$cmd.Parameters.AddWithValue('@DisplayName', $obj.Metadata.ProcedureDescription) | Out-Null
$cmd.Parameters.AddWithValue('@ID_Table', $obj.Metadata.Table) | Out-Null
$cmd.Parameters.AddWithValue('@ID_ActionType', $obj.Metadata.PrefixType.ToLower()) | Out-Null
$cmd.Parameters.AddWithValue('@RequiresRecord', $requiresRecord) | Out-Null
$cmd.Parameters.AddWithValue('@ID_TableRelated', 'NULL') | Out-Null
$cmd.Parameters.AddWithValue('@IsAnonymous', $false) | Out-Null

$reader = $cmd.ExecuteReader() 

if ($reader.Read()) {
    # save definition to temp
    $output = $reader['definition']
    $path = Join-Path -Path $env:temp -ChildPath "$($table).sql"
    $output | Out-File -filepath $path
    # and run
    Start-Process -filepath $path
}

$reader.Close()

## query get action script
$q = (Get-Content .\Scripts\MsSQL\Procedures\SQL\New-Action-Custom.sql -Encoding UTF8) -join "`n"
$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)

$cmd.Parameters.AddWithValue('@ID_Action', $obj.Metadata.ProcedureName) | Out-Null
$cmd.Parameters.AddWithValue('@DisplayName', $obj.Metadata.ProcedureDescription) | Out-Null
$cmd.Parameters.AddWithValue('@ID_Table', $obj.Metadata.Table) | Out-Null
$cmd.Parameters.AddWithValue('@ID_ActionType', $obj.Metadata.PrefixType.ToLower()) | Out-Null
$cmd.Parameters.AddWithValue('@RequiresRecord', $requiresRecord) | Out-Null
$cmd.Parameters.AddWithValue('@ID_TableRelated', 'NULL') | Out-Null
$cmd.Parameters.AddWithValue('@IsAnonymous', $false) | Out-Null

$reader = $cmd.ExecuteReader() 

if ($reader.Read()) {
    # save definition to temp
    $output = $reader['definition']
    $path = Join-Path -Path $env:temp -ChildPath "$($table).sql"
    $output | Out-File -filepath $path
    # and run
    Start-Process -filepath $path
}

$conn.Close() 

# vratim data
$data