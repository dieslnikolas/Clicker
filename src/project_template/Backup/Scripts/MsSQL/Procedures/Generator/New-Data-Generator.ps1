param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

# Display debug info
$debug = $false;

# connString
$conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
$conn.Open()

$proc = ($data.ProcessItem.GetEnumerator() | Select-Object -first 1).Value["Name"]

$table = $proc.Substring(0, $proc.IndexOf('_',3)) # "CR_CompanyContact"
$tablename = $proc.Substring(3, $proc.IndexOf('_',3)-3)
$defaultLogin = ' @ID_Login="10000000-0000-0000-0000-000000000001"'
$pluralName = Get-Pluralize $tablename
$description = ''
$tablerelationid = ''
$tableid = $tablename
$modules = 'Core'
$postfix = ''

# $pluralName = 'Companies'

## query & cmd
$q = (Get-Content .\Scripts\MsSQL\Procedures\SQL\New-Data-Generator.sql -Encoding UTF8) -join "`n"
$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)

$cmd.Parameters.AddWithValue('@table', $table) | Out-Null
$cmd.Parameters.AddWithValue('@action', $proc) | Out-Null

$reader = $cmd.ExecuteReader() 
$alterprefix = $false
$alterTable = $tablename

if ($reader.Read()) {
    
    $description = $reader['TableName']
    $procedureDescription = $reader['ActionName']
    $modules = $reader['Module']

    if ($reader['ID'] -ne $table) {
        $alterprefix = $true
    }


    if (!([DBNull]::Value).Equals($reader['ID_TableRelated'])) {
        $tablerelationid = $reader['ID_TableRelated'].ToString()
        $tablerelationname = $tablerelationid.Substring(3)
    }

    if(!([DBNull]::Value).Equals($reader['ActionTable'])){
        $actionTable = $reader['ActionTable'].ToString()
    }

    # meh?
    $table = $reader['ID']
    $tablename = $table.Substring(3)
    $pluralName = Get-Pluralize $tablename
    # ID_Table from procedure
    $tableid = $proc.SubString(0, $proc.IndexOf('_', 3)) #$tablename

    if($debug){
        "<Table>"
        "   Table: {0}" -f $table
        "   TableName: {0}" -f $tablename
        "   PluralName: {0}" -f $pluralName
        "   Table: {0}" -f $table
        "   TableId: {0}" -f $tableid
        "   ActionTable: {0}" -f $actionTable
        "</Table>"
    }
    
    
}

$reader.Close()

# Get alternative procedure description (from comment in procedure) if Action does not exist
if($debug){
    "<Procedure description>"
    "   {0}" -f $procedureDescription     
    "</Procedure description>"
}
if($null -eq $procedureDescription -or '' -eq $procedureDescription){

    $q = (Get-Content .\Scripts\MsSQL\Procedures\SQL\Show-Procedure-Description.sql -Encoding UTF8) -join "`n"
    $cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
    $cmd.Parameters.AddWithValue('@ProcedureName', $proc) | Out-Null

    $reader = $cmd.ExecuteReader()

    if($reader.Read()){
        $procedureDescription = $reader['description']
    }

    $reader.Close()
}

# local variables

$prefix = ''
$prefixType = ''
$operationType = ''

if ($proc.Contains('ALL')) {
    $prefix = 'All'
    $operationType = 'ALL'
} elseif ($proc.Contains('DETAIL')) {
    $prefix = 'Detail'
    $operationType = 'DETAIL'
} elseif ($proc.Contains('NEW')) {
    $prefix = 'New'
    $operationType = 'NEW'
} elseif ($proc.Contains('EDIT')) {
    $prefix = 'Edit'
    $operationType = 'EDIT'
} elseif ($proc.Contains('DEL')) {
    $prefix = 'Del'
    $operationType = 'DEL'
} elseif ($proc.Contains('ACTION')) {
    $prefix = 'Action'
    $operationType = 'ACTION'
} elseif ($proc.Contains('VALIDATE')) {
    $prefix = 'Validate'
    $operationType = 'VALIDATE'
}

# AllCompany_WS
$prefixType = $prefix # All
$prefixExtension = "" # Company
$suffix = "" # WS

if ($alterprefix) {
    $prefixExtension = $alterTable
    $prefixExtensionSuffix = $postfix
    $prefix = $prefix + ($prefixExtension) + $prefixExtensionSuffix
} else {
    $prefixStart = $proc.IndexOf($operationType)
    if ($proc.Length -gt $prefixStart) {
        $temp = $proc.SubString($prefixStart) # Prefix to the end

        # Suffix ?
        $suffixStart = $temp.LastIndexOf("_") + 1 # Find suffix separated by underscore
        if($suffixStart -gt 0 -and $temp.Length -gt $suffixStart){
            $suffixTemp = $temp.Substring($suffixStart) # Suffix
            # Is it specified as a suffix? (or is it just a part of extension?)
            if($data.Metadata.Suffixes.Contains($suffixTemp)){
                $suffix = $suffixTemp
                # Remove suffix from temp
                $temp = $temp.Substring(0, $temp.Length - ($suffix.Length + 1))
            }

        }

        # Extension ?
        $prefixExtensionStart = $prefixType.Length + 1
        if($prefixExtensionStart -gt 0 -and $temp.Length -gt $prefixExtensionStart){
            $prefixExtension = $temp.SubString($prefixExtensionStart) # Extension
        }

        # Remove underscores from extension
        $prefixExtension = $prefixExtension.Replace('_', '')
        
        # Finalize prefix
        $prefix = $prefixType + $prefixExtension + $suffix
    }
}

<#-- 
$prefix = 'Create'
$table = 'CR_Company'
$tablename = 'Company'
$pluralName = 'Companies'
--#>

if ($tablerelationid -ne '') {
    $table = $tablerelationid
}

# Procedure: IA_Employee_ALL_CompanyChat_WS
# Name:                     Employee
# Prefix:                   AllCompanyChatWS
# OperationType:            All
# PrefixExtension:          CompanyChat
# Suffix:                   WS 

$operationItem = [ordered]@{ }
$operationItem.Metadata = [ordered]@{
    Modules = $modules # Core atd
    Name = $tablename # napr. User
    Table = $tableid # ?? zjistit
    ActionTable = $actionTable # Table according to its action (related to the action procedure)
    TableRelation = $tablerelationname # nic nebo dle vazeb
    PluralName = $pluralName # napr. Users
    Description = $description # popis modulu
    Prefix = $prefix # prefix = PrefixType + PrefixExtension + Suffix
    #PrefixExtend = (($prefix.Replace('List',''), 'Index')[$prefix -eq "List"]) -creplace "(.*)_WS(.*)", '$1$2'  # Nahrada za index u listu a odstranění WS u WebService
    PrefixType = $prefixType # All | Detail | Create | Edit | Delete!
    PrefixExtension = $prefixExtension # CompanyChat
    Suffix = $suffix # WS | User | - configured in settings!
    OperationType = $operationType # ALL | DETAIL | NEW | EDIT | DEL | BLANK
    ProcedureName = $proc
    ProcedureDescription = $procedureDescription # popis procedury
}

if($debug){
    "<metadata>"
    "   Modules: {0}" -f $operationItem.Metadata.Modules
    "   Name : {0}" -f $operationItem.Metadata.Name
    "   Table: {0}" -f $operationItem.Metadata.Table
    "   ActionTable: {0}" -f $operationItem.Metadata.ActionTable
    "   TableRelation: {0}" -f $operationItem.Metadata.TableRelation
    "   PluralName: {0}" -f $operationItem.Metadata.PluralName
    "   Description: {0}" -f $operationItem.Metadata.Description
    "   Prefix: {0}" -f $operationItem.Metadata.Prefix
    "   PrefixType: {0}" -f $operationItem.Metadata.PrefixType
    "   PrefixExtension: {0}" -f $operationItem.Metadata.PrefixExtension
    "   Suffix: {0}" -f $operationItem.Metadata.Suffix
    "   OperationType: {0}" -f $operationItem.Metadata.OperationType
    "   ProcedureName: {0}" -f $operationItem.Metadata.ProcedureName
    "   ProcedureDescription: {0}" -f $operationItem.Metadata.ProcedureDescription
    "</metadata>"
}

$sb = New-Object System.Text.StringBuilder
function Append([string]$txt) {
    $sb.Append($txt) | Out-Null
}

# params
$inputParams = @()
$outputParams = @()
$names = @()
$fks = @()
$nullables = @()

## names
$q = "select 
	c.name,
	'description' = convert(nvarchar(max), ex.value)
from 
	sys.columns c left join sys.extended_properties ex ON  ex.major_id = c.object_id and c.column_id=ex.minor_id
where OBJECT_NAME(c.object_id) = @TableName"

$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@TableName', $table) | Out-Null
$reader = $cmd.ExecuteReader()

while ($reader.Read()){
    $item = New-Object System.Object 

    $item | Add-Member -MemberType NoteProperty -Name "Name" -Value $reader['name']
    $item | Add-Member -MemberType NoteProperty -Name "Description" -Value $reader['description']

    $names+=($item) # pridam do kolekce
}
$reader.Close()


## FKs
$q = "SELECT
        ConstraintName = a.CONSTRAINT_NAME,
        FromTable = c.TABLE_NAME,
        FromColumn = c.COLUMN_NAME,
        ToTable = d.TABLE_NAME,
        ToColumn = d.COLUMN_NAME
        FROM
        INFORMATION_SCHEMA.TABLE_CONSTRAINTS a,
        INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS b,
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE c,
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE d
        WHERE c.TABLE_NAME = @TableName
        and a.CONSTRAINT_NAME = b.CONSTRAINT_NAME
        and a.CONSTRAINT_NAME = c.CONSTRAINT_NAME
        and b.UNIQUE_CONSTRAINT_NAME = d.CONSTRAINT_NAME
        and c.ORDINAL_POSITION = d.ORDINAL_POSITION
        ORDER BY a.CONSTRAINT_NAME, c.ORDINAL_POSITION"

$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@TableName', $table) | Out-Null
$reader = $cmd.ExecuteReader()

while ($reader.Read()){
    $item = New-Object System.Object 

    $item | Add-Member -MemberType NoteProperty -Name "ConstraintName" -Value $reader['ConstraintName']
    $item | Add-Member -MemberType NoteProperty -Name "FromTable" -Value $reader['FromTable']
    $item | Add-Member -MemberType NoteProperty -Name "FromColumn" -Value $reader['FromColumn']
    $item | Add-Member -MemberType NoteProperty -Name "ToTable" -Value $reader['ToTable']
    $item | Add-Member -MemberType NoteProperty -Name "ToColumn" -Value $reader['ToColumn']

    $fks+=($item) # pridam do kolekce
}
$reader.Close()

## nullables
$q = "SELECT COLUMN_NAME, IS_NULLABLE FROM INFORMATION_SCHEMA.Columns where TABLE_NAME = @TableName"

$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@TableName', $table) | Out-Null
$reader = $cmd.ExecuteReader()

while ($reader.Read()){
    $item = New-Object System.Object 

    $item | Add-Member -MemberType NoteProperty -Name "Name" -Value $reader['COLUMN_NAME']
    $item | Add-Member -MemberType NoteProperty -Name "IsNullable" -Value $reader['IS_NULLABLE']

    $nullables+=($item) # pridam do kolekce
}
$reader.Close()

## inputParams
$q = "SELECT PARAMETER_NAME, DATA_TYPE, PARAMETER_MODE, CHARACTER_MAXIMUM_LENGTH
                        FROM INFORMATION_SCHEMA.PARAMETERS
                        where SPECIFIC_NAME=@ProcName
                        order by ORDINAL_POSITION"

$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@ProcName', $proc) | Out-Null
$reader = $cmd.ExecuteReader() 

while ($reader.Read()){
    $item = New-Object System.Object 

    $item | Add-Member -MemberType NoteProperty -Name "Name" -Value $reader['PARAMETER_NAME']
    $item | Add-Member -MemberType NoteProperty -Name "Type" -Value $reader['DATA_TYPE']
    $item | Add-Member -MemberType NoteProperty -Name "Mode" -Value $reader['PARAMETER_MODE']
    $item | Add-Member -MemberType NoteProperty -Name "Length" -Value $reader['CHARACTER_MAXIMUM_LENGTH']

    $inputParams+=($item) # pridam do kolekce

    if ($item.Name.StartsWith('@id', "CurrentCultureIgnoreCase") -and $item.Name -notlike('@ID_Login')) {
        Append($item.Name)
        Append('=0,')
    }
}
$reader.Close()

## outputParams
$q = $proc +' '+ $sb.ToString() + $defaultLogin
$outputParams = @{}

if ($operationType -in ('ALL','DETAIL')) {
    $cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
    $reader = $cmd.ExecuteReader() 
    $outputParams = $reader.GetSchemaTable() | Select-Object ColumnName, ColumnOrdinal, AllowDBNull, DataType, DataTypeName, ColumnSize
}

$conn.Close() 

#
# --- DATA ---
#
$data.TempData = [ordered]@{}
$data.TempData.Add($tablename+$prefix, $operationItem)

$operationItem.InputColumns = [ordered]@{}
$operationItem.OutputColumns = [ordered]@{}

foreach ($i in $inputParams) {
    $name = $i.Name.SubString(1)
    $description = $name
    $isIk = $false
    $isNullable = $false
    $isRequired = $false
    $type = $i.Type
    $dbtype = $i.Type
    $utilsType = $i.Type
    $listName = ''
    $fktablename = ''

    switch($type) {
        'nvarchar' 
        { 
            $type='string'
            $utilsType='String'
            $dbtype='NVarChar' 
        }
        'uniqueidentifier'
        { 
            $type='Guid'
            $utilsType='Guid'
            $dbtype='UniqueIdentifier' 
        }
        'int'
        { 
            $type='int'
            $utilsType='Int'
            $dbtype='Int' 
        }
        'bigint'
        { 
            $type='int'
            $utilsType='Int'
            $dbtype='BigInt' 
        }
        'bit'
        {
            $type='bool'
            $utilsType='Bool'
            $dbtype='Bit' 
        }
        'date'
        {
            $type='DateTime'
            $utilsType='DateTime'
            $dbtype='Date' 
        } 
        'datetime'
        {
            $type='DateTime'
            $utilsType='DateTime'
            $dbtype='DateTime' 
        } 
        'time'
        {
            $type='TimeSpan'
            $utilsType='TimeSpan'
            $dbtype='Time' 
        }
        'float'
        {
            $type='float'
            $utilsType='Double'
            $dbtype='Double' 
        }   
        'decimal'
        {
            $type = 'decimal'
            $utilsType='Decimal'
            $dbtype = 'Decimal'
        }
        'varchar' 
        { 
            $type='string'
            $utilsType='String'
            $dbtype='VarChar' 
        }
    }

    foreach ($n in $names) {
        if ($name -like $n.Name) {
            $description = $n.Description
            break;
        }
    }

    foreach ($f in $fks) {
        if ($f.FromColumn -like $name) {
            $isIk = $true
            $fktablename = $f.ToTable.Substring(3)
            $listName = Get-Pluralize $fktablename
            break;
        }
    }

    foreach ($n in $nullables) {
        if ($n.Name -like $name) {
            if ($i.Type -ne 'nvarchar' -and $n.IsNullable -like 'YES') {
                $isNullable = $true
            }
            if ($n.IsNullable -like 'NO') {
                $isRequired = $true
            }
            break;
        }
    }

    # top & id
    if ((($name -ilike 'id' -or $name -ilike 'top') -and $type -eq 'int') -and $operationType -eq 'ALL')  {
        $isNullable = $true
    }

    $operationItem.InputColumns.Add($name, [ordered]@{
        Type = $type
        DbType = $dbtype
        UtilsType = $utilsType
        IsOutput = $i.Mode.Contains('INOUT')
        IsRequired = $isRequired # povinna polozka [Required]
        IsNullable = $isNullable # nullable - vyuzije se u ?
        IsPK = $name -like 'id'
        IsFk = $isIk
        Description = $description
        Name = $name
        TableName = $fktablename
        ListName = $listName
    })
    
    if ($i.Mode.Contains('INOUT')) {
        $operationItem.OutputColumns.Add($name, [ordered]@{
            DbType = $dbtype
            UtilsType = $utilsType
            Type = $type
            IsOutput = $true
            IsRequired = $true
            IsNullable = $false # nullable - vyuzije se u ?
            IsPK = $name -like 'id'
            IsFk = $isIk
            Description = $description
            Name = $name
            TableName = $fktablename
            ListName = $listName
        })
    }
}

if($debug){
    "<columns>"
}
foreach ($o in $outputParams) {
    if ($outputParams.Count -eq 0) {
        break;
    }

    # ColumnName, ColumnOrdinal, AllowDBNull, DataType, DataTypeName, ColumnSize
    $name = $o.ColumnName

    $description = $name
    $isIk = $false
    $listName = ''
    $fktablename = ''

    foreach ($n in $names) {
        if ($name -like $n.Name) {
            $description = $n.Description
            break;
        }
    }

    foreach ($f in $fks) {
        if ($f.FromColumn -like $name) {
            $isIk = $true
            $fktablename = $f.ToTable.Substring(3)
            $listName = Get-Pluralize $fktablename
            break;
        }
    }

    $type = $o.DataTypeName
    $dbtype = $o.Type
    $utilsType = $o.Type

    switch($type) {
        'nvarchar' 
        { 
            $type='string'
            $utilsType='String'
            $dbtype='NVarChar' 
        }
        'uniqueidentifier'
        { 
            $type='Guid'
            $utilsType='Guid'
            $dbtype='UniqueIdentifier' 
        }
        'int'
        { 
            $type='int'
            $utilsType='Int'
            $dbtype='Int' 
        }
        'bigint'
        { 
            $type='int'
            $utilsType='Int'
            $dbtype='BigInt' 
        }
        'bit'
        {
            $type='bool'
            $utilsType='Bool'
            $dbtype='Bit' 
        }
        'date'
        {
            $type='DateTime'
            $utilsType='DateTime'
            $dbtype='Date' 
        } 
        'datetime'
        {
            $type='DateTime'
            $utilsType='DateTime'
            $dbtype='DateTime' 
        } 
        'time'
        {
            $type='TimeSpan'
            $utilsType='TimeSpan'
            $dbtype='Time' 
        }
        'float'
        {
            $type='float'
            $utilsType='Double'
            $dbtype='Double' 
        }   
        'decimal'
        {
            $type = 'decimal'
            $utilsType='Decimal'
            $dbtype = 'Decimal'
        }
        'varchar' 
        { 
            $type='string'
            $utilsType='String'
            $dbtype='VarChar' 
        }
    }
    
    # Non-nullable types ('?' in property)
    $IsNullable = $false
    $IsRequired = $false
    if($o.DataTypeName -ne ('nvarchar') -and $o.AllowDBNull){
        $IsNullable = $true
    }
    if($o.AllowDBNull -eq $false){
        $IsRequired = $true
    }

    if($debug){
        "   Nullable: {0}, IsRequired: {1}, Name: {2}" -f $isNullable, $IsRequired, $Name
    }

    $operationItem.OutputColumns.Add($name, [ordered]@{
        DbType = $o.DataType.Name
        UtilsType = $utilsType
        Type = $type
        IsRequired = $IsRequired #($o.AllowDBNull -eq $false) # povinna polozka [Required]
        IsNullable = $IsNullable #$o.AllowDBNull #($o.AllowDBNull -eq $true)   # $IsNullable #$false # nullable - vyuzije se u ?
        IsPK = $name -like 'id'
        IsFk = $isIk
        Description = $description
        Name = $name
        TableName = $fktablename
        ListName = $listName
    })

}
if($debug){
    "</columns>"
}

# prekopirovani popisky od FK k jejich DisplayNames (napr. od ID_Invoice do Invoice)
$columns = $operationItem.OutputColumns.GetEnumerator()
$innerColumns = $operationItem.OutputColumns.GetEnumerator()

foreach ($oColumn in $columns) {
    if ($oColumn.Value.Name.StartsWith('ID_')) {
        $innerName = $oColumn.Value.Name.Replace('ID_','')
        
        foreach ($oColumnInner in $innerColumns) {
            if ($oColumnInner.Value.Name -like $innerName) {
                $oColumnInner.Value.Description = $oColumn.Value.Description
                break
            }
        }
    }
}

$columns = $operationItem.InputColumns.GetEnumerator()
$innerColumns = $operationItem.InputColumns.GetEnumerator()

foreach ($oColumn in $columns) {
    if ($oColumn.Value.Name.StartsWith('ID_')) {
        $innerName = $oColumn.Value.Name.Replace('ID_','')
        
        foreach ($oColumnInner in $innerColumns) {
            if ($oColumnInner.Value.Name -like $innerName) {
                $oColumnInner.Value.Description = $oColumn.Value.Description
                break
            }
        }
    }
}

$data