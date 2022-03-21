param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

If (!(Get-module Powergene)) {
    Import-Module .\Scripts\modules\Powergene\Powergene.psm1
}

$table = ""
$FinalProcessItem = $null
Foreach ($key in $data.ProcessItem.Keys) {
    # jobject!
    $FinalProcessItem = $data.ProcessItem[$key]
    if ($data.ProcessItem[$key]["Name"].Value -eq $null) {
        $table = $data.ProcessItem[$key]["Name"] 
    } else {
        $table = $data.ProcessItem[$key]["Name"].Value 
    }
    
    break
}

$tablename = $table #.Substring(3)
$pluralName = Get-Pluralize $tablename
$description = ''
$tablerelationid = ''
$tableid = $tablename
$modules = 'Core'

# $pluralName = 'Companies'


# local variables

<#-- 
$prefix = 'Create'
$table = 'CR_Company'
$tablename = 'Company'
$pluralName = 'Companies'
--#>

if ($tablerelationid -ne '') {
    $table = $tablerelationid
}

$operationItem = [ordered]@{ }
$operationItem.Metadata = [ordered]@{
    Modules = $modules # Core atd
    Name = $tablename # napr. User
    Table = $table # ?? zjistit
    TableRelation = $tablerelationname # nic nebo dle vazeb
    PluralName = $pluralName # napr. Users
    Description = $description # popis modulu
}

# connString
$conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
$conn.Open()
$defaultLogin = ' @ID_Login="10000000-0000-0000-0000-000000000001"'

# params
$columns = @()
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
    ToColumn = d.COLUMN_NAME,
	cols.name as DisplayName
FROM
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS a,
    INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS b,
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE c,
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE d
	left join sys.columns cols on OBJECT_NAME(cols.object_id)=d.TABLE_NAME and cols.name like 'name'
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
    $item | Add-Member -MemberType NoteProperty -Name "DisplayName" -Value $reader['DisplayName']

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

## columns
$q = "select col.name as ColumnName, types.name as TypeName, case when types.name like '%varchar' then col.max_length else null end as [Length], convert(nvarchar(max), ex.value) as [Description]
from
  sys.tables as tables
  inner join sys.columns as col on tables.object_id=col.object_id
  inner join sys.types as types on col.system_type_id=types.system_type_id and col.user_type_id=types.user_type_id
  left join sys.extended_properties ex ON  ex.major_id = col.object_id and col.column_id=ex.minor_id
where
	tables.name=@TableName"

$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@TableName', $table) | Out-Null
$reader = $cmd.ExecuteReader() 

while ($reader.Read()){
    $item = New-Object System.Object 

    $item | Add-Member -MemberType NoteProperty -Name "Name" -Value $reader['ColumnName']
    $item | Add-Member -MemberType NoteProperty -Name "Type" -Value $reader['TypeName']
    $item | Add-Member -MemberType NoteProperty -Name "Length" -Value $reader['Length']
    $item | Add-Member -MemberType NoteProperty -Name "Description" -Value $reader['Description']

    $columns+=($item) # pridam do kolekce
}
$reader.Close()

#
# --- DATA ---
#
$data.TempData = [ordered]@{}
$data.TempData.Add($table, $operationItem)

$operationItem.Columns = [ordered]@{}
$operationItem.ProcessItem = [ordered]@{}

foreach ($i in $columns) {
    $name = $i.Name #.SubString(1)
    $description = $name
    $isIk = $false
    $isNullable = $false
    $isRequired = $false
    $type = $i.Type
    $dbtype = $i.Type
    $typeLength = $i.Length
    $listName = ''
    $fktable = ''
    $fktablename = ''
    $fkdisplayname = ''

    switch($type) {
        'nvarchar' 
        { 
            $type='string'
            $dbtype='String' 
        }
        'GUID'
        { 
            $type='Guid'
            $dbtype='Guid' 
        }
        'uniqueidentifier'
        { 
            $type='Guid'
            $dbtype='Guid' 
        }
        'int'
        { 
            $type='int'
            $dbtype='Int32' 
        }
        'bit'
        {
            $type='bool'
            $dbtype='Boolean' 
        }
        'date'
        {
            $type='DateTime'
            $dbtype='DateTime' 
        } 
        'datetime'
        {
            $type='DateTime'
            $dbtype='DateTime' 
        } 
        'time'
        {
            $type='TimeSpan'
            $dbtype='Time' 
        }
        'float'
        {
            $type='float'
            $dbtype='Double' 
        }   
        'decimal'
        {
            $type = 'decimal'
            $dbtype = 'Decimal'
        }
        'IDVC' 
        { 
            $type='string'
            $dbtype='String' 
        }
        'DN' 
        { 
            $type='string'
            $dbtype='String' 
        }
        'Note' 
        { 
            $type='string'
            $dbtype='String' 
        }
        'IsActive'
        {
            $type='bool'
            $dbtype='Boolean' 
        }
        'ID'
        { 
            $type='int'
            $dbtype='Int32' 
        }
        'datetimeoffset'
        { 
            $type='DateTimeOffset'
            $dbtype='DateTimeOffset' 
        }
        'geography'
        {           
            $type='Point'
            $dbtype='geography' 
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
            $fktable = $f.ToTable
            $fktablename = $f.ToTable #.Substring(3)
            $listName = Get-Pluralize $fktablename
            $fkdisplayname = $f.DisplayName
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

    $operationItem.Columns.Add($name, [ordered]@{
        Type = $type
        DbType = $dbtype
        TypeLength = $typeLength
        OriginalType = $i.Type
        IsRequired = $isRequired # povinna polozka [Required]
        IsNullable = $isNullable # nullable - vyuzije se u ?
        IsPK = $name -like $table+'Id'
        IsFk = $isIk
        Description = $description
        Name = $name
        Table = $fktable
        TableName = $fktablename
        ListName = $listName
        FkColumnName = $fkdisplayname
    })
}

$data