param (
    $table,
    $suffix,
    $procedureName,
    $name
)

Write-Host "Table "     $table 
Write-Host "Suffix "    $suffix 
Write-Host "Procedure " $procedureName 
Write-Host "Name"       $name


# connString
$conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
$conn.Open()

#$Global:PrintMessage = ''
#$handler = [System.Data.SqlClient.SqlInfoMessageEventHandler] {param($sender, $event)$Global:PrintMessage = $event.Message } 
#$conn.add_InfoMessage($handler) | Out-Null

$table = ($data.ProcessItem.GetEnumerator() | select -first 1).Value["Name"]

$missingAction = $false

## query & cmd
$q = $procedureName
$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.CommandType = [System.Data.CommandType]::StoredProcedure




$cmd.Parameters.AddWithValue('@ID_Login', [system.guid]::empty) | Out-Null
$cmd.Parameters.AddWithValue('@ID_Table', $table) | Out-Null
#$cmd.Parameters.AddWithValue('@Suffix', $Suffix) | Out-Null
$cmd.Parameters.AddWithValue('@Exec', $false) | Out-Null
$cmd.Parameters.AddWithValue('@Print', $false) | Out-Null
$cmd.Parameters.AddWithValue('@Select', $true) | Out-Null

try{
    $reader = $cmd.ExecuteReader()
}catch{
    Write-Host $($PSItem.ToString())
    $missingAction = $true
}

$output = $null
if ($reader.Read() -And $missingAction -eq $false ) {
    $output = $reader['SQL']
}

$reader.Close() | Out-Null

# Create new action
if($missingAction){
    $ID_Action = $name
    $procedureDescription = "DESCRIPTION"
    $ID_Table = $table
    $indexUnderscore = $name.LastIndexOf('_') + 1
    $ID_ActionType = $name.Substring($indexUnderscore, $name.Length - $indexUnderscore ).ToLower()
    $tableRelated = 'NULL'
    $isAnonymous = $false
    $requiresRecord = $false
    if($ID_ActionType -in ('all', 'new', '')){
        $requiresRecord = $false
    }elseif ($ID_ActionType -in ('edit', 'detail', 'del')) {
        $requiresRecord = $true
    }

    ## query & cmd
    $q = (Get-Content .\Scripts\MsSQL\Tables\SQL\New-Action-Custom.sql -Encoding UTF8) -join "`n"
    $cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
    
    $cmd.Parameters.AddWithValue('@ID_Action', $ID_Action) | Out-Null
    $cmd.Parameters.AddWithValue('@DisplayName', $procedureDescription) | Out-Null
    $cmd.Parameters.AddWithValue('@ID_Table', $ID_Table) | Out-Null
    $cmd.Parameters.AddWithValue('@ID_ActionType', $ID_ActionType) | Out-Null
    $cmd.Parameters.AddWithValue('@RequiresRecord', $requiresRecord) | Out-Null
    $cmd.Parameters.AddWithValue('@ID_TableRelated', $tableRelated) | Out-Null
    $cmd.Parameters.AddWithValue('@IsAnonymous', $isAnonymous) | Out-Null
    
    $reader = $cmd.ExecuteReader() 
    
    if ($reader.Read()) {
        # save definition to temp
        $output = $reader['definition']
        $path = Join-Path -Path $env:temp -ChildPath "$($table).sql"
        $output | Out-File -filepath $path
        # and run - is in specific command
        #Start-Process -filepath $path 
    }
        
    $reader.Close()
    # $conn.Close() 
}
$conn.Close() | Out-Null

# vratim text
$output
    