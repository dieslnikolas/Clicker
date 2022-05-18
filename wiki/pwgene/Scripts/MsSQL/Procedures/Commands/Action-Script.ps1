param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

$debug = $true

.\Scripts\MsSQL\Procedures\Generator\New-Data-Generator.ps1 $data
$obj = $data.TempData[$data.TempData.Keys[0]]


$clipboard = "
        or
            
        -- {0}: {1}
        (SF_Action.ID='{0}')" -f $obj.Metadata.ProcedureName, $obj.Metadata.ProcedureDescription


Set-Clipboard -Value $clipboard
"ACTION Script in clipboard"

# "Table: {0}" -f $obj.Metadata.Table
# "TableName: {0}" -f $obj.Metadata.TableName

# Show ACTION procedure

# connString
$conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
$conn.Open()

$actionProc = "{0}_ACTION" -f $obj.Metadata.ActionTable

## query & cmd
$q = "
select sys.sql_modules.definition from sysobjects 
left join sys.sql_modules on sys.sql_modules.object_id = sysobjects.id
where name = @name
"

$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@name', $actionProc) | Out-Null
$reader = $cmd.ExecuteReader() 

if ($reader.Read()) {
    # save definition to temp
    $output = $reader['definition']

    #replace create > alter
    $output =  $output -ireplace "CREATE PROCEDURE", "ALTER PROCEDURE"
    
    $path = Join-Path -Path $env:temp -ChildPath "$($actionProc).sql"
    $output | Out-File -filepath $path
    # and run
    Start-Process -filepath $path
}

$reader.Close()
$conn.Close() 


"ACTION Script:"
""
"{0}" -f $clipboard
""


# $table = ($data.ProcessItem.GetEnumerator() | select -first 1).Value["Name"]

# # connString
# $conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
# $conn.Open()

# # $table = $obj.Metadata.ProcedureName.SubString(0, $data.Metadata.TableName.Length + 3) # IA_TableName => TableName.Length + 3


# $requiresRecord = $null

# if($obj.Metadata.PrefixType -in ('All', 'New')){
#     # Table
#     $requiresRecord = $false
# }elseif ($obj.Metadata.PrefixType -in ('Edit', 'Detail', 'Del')) {
#     # Record
#     $requiresRecord = $true
# }

# if ($debug){
#     "Params: "
#     "   Table: {0}" -f $obj.Metadata.Table
#     "   Action: {0}" -f $obj.Metadata.ProcedureName
#     "   DisplayName: {0}" -f $obj.Metadata.ProcedureDescription
#     "   ActionType: {0}" -f $obj.Metadata.PrefixType
#     "   RequiresRecord: {0}" -f $requiresRecord
# }

# if($null -ne $requiresRecord){
#     # Add quick action
#     ## query & cmd
#     $q = (Get-Content .\Scripts\MsSQL\Procedures\SQL\Insert-Into-Action.sql -Encoding UTF8) -join "`n"
#     $cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
    
#     $cmd.Parameters.AddWithValue('@ID_Action', $obj.Metadata.ProcedureName) | Out-Null
#     $cmd.Parameters.AddWithValue('@DisplayName', $obj.Metadata.ProcedureDescription) | Out-Null
#     $cmd.Parameters.AddWithValue('@ID_Table', $obj.Metadata.Table) | Out-Null
#     $cmd.Parameters.AddWithValue('@ActionType', $obj.Metadata.PrefixType.ToLower()) | Out-Null
#     $cmd.Parameters.AddWithValue('@RequiresRecord', $requiresRecord) | Out-Null
    
#     $reader = $cmd.ExecuteReader() 
    
#     if($reader.Read()){
#         "{0}" -f $reader.GetValue(0)
#     }

#     # ACTION Script to clipboard

#     $clipboard = "or
            
# -- {0}: {1}
# (SF_Action.ID='{0}')" -f $obj.Metadata.ProcedureName, $obj.Metadata.ProcedureDescription

# #Set-Clipboard -Value $clipboard
# #"ACTION Script in clipboard"

# "ACTION Script:"
# ""
# "{0}" -f $clipboard
# ""
# }else{
#     # Add custom action
#     "ActionType not recognized: {0}" -f $obj.Metadata.PrefixType
# }



$data