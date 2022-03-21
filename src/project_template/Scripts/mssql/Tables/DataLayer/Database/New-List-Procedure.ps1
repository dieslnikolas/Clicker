param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

$tlbname = $data.Metadata.Name
$date = Get-Date -Format "dd.MM.yyyy"
$allowedColumns = @('Code','Name', 'Deleted') # sloupce nejsou FK, ale typicky byvaji ve filtrech

Add-Line('------------------------------------------------------------------------------------------------------')
Add-Line('-- {0}List' -f $tlbname)
Add-Line('------------------------------------------------------------------------------------------------------')
Add-Line('-- Autor: {0}' -f [Environment]::UserName)
Add-Line('-- Datum: {0}' -f $date)
Add-Line('------------------------------------------------------------------')
Add-Line('CREATE OR ALTER PROCEDURE dbo.{0}List' -f $tlbname)
Add-Line('	@LanguageId uniqueidentifier,')
Add-Line('	@RowCount int = 0,')

# filters
Add-Line('  -- filters')
$isUsed = $false
foreach ($column in $data.Columns.GetEnumerator())
{  
    if ($column.Value.Name -like 'LanguageId') { 
        continue;
    }
    elseif ($column.Value.IsPk -eq $true -or $column.Value.IsFK -eq $true -or $allowedColumns.contains($column.Value.Name)) {
        $isUsed = $true
        Add-Line('	@{0} {1}{2} = null,' -f 
            $column.Value.Name,
            $column.Value.OriginalType,
            ('',('('+$column.Value.TypeLength+')'))[($column.Value.OriginalType -like 'nvarchar')]
            )
    }
}

# odstraneni posledni carky
if ($isUsed -eq $true) {
    Remove-LastChar
    Remove-LastChar
    Remove-LastChar
    Add-Line('')
}


Add-Line('AS')
Add-Line('BEGIN')

# generated

Get-GenerateDbLine $data
Add-Line('')

# promenne
Add-Line('  declare @SQL nvarchar(max)')
Add-Line('  declare @Filters nvarchar(max) = ''''')
Add-Line('  declare @AddFilter nvarchar(max) = ''''')
Add-Line('')


# bez topu
Add-Line('  --default sql')
Add-Line('  if (@RowCount=0)')
Add-Line('  begin')
Add-Line('    SET @sql = ''SELECT
''')
Add-Line('  end')

# top
Add-Line('  else')
Add-Line('  begin')
Add-Line('    SET @sql = ''SELECT TOP(@RowCount)
''')
Add-Line('  end')


Add-Line('')
Add-Line('  -- columns')
Add-Line('  SET @sql = @sql + ''')

# columns
$count = 1
foreach ($column in $data.Columns.GetEnumerator())
{  
    if ($column.Value.IsFK -eq $true -and -not [string]::IsNullOrEmpty($column.Value.FkColumnName)) {
        Add-Line('    ''''{0}''''=[{0}].[{1}],' -f (($column.Value.Name -replace "..$"), $tlbname)[[string]::IsNullOrEmpty($column.Value.Table)], $column.Value.FkColumnName,(',', '')[($count -ge $data.Columns.Count)])
    }
    Add-Line('    [{0}].[{1}]{2}' -f $tlbname, $column.Value.Name, (',', '')[($count -ge $data.Columns.Count)])

    $count++
}

# odstraneni posledni carky
if ($isUsed -eq $true) {
    #Remove-LastChar
    Remove-LastChar
    Remove-LastChar
    Add-Line('')
}

Add-Line('''')

# SQL joins
Add-Line('    -- joins')
Add-Line('    SET @sql = @sql + ''')
Add-Line('FROM')
Add-Line('    [{0}]' -f $tlbname)
foreach ($column in $data.Columns.GetEnumerator())
{  
    if ($column.Value.IsFK -eq $true) {
        Add-Line('    {0} JOIN [{1}] AS [{2}] ON [{2}].[{2}Id] = [{4}].[{3}]' -f 
            ('LEFT', 'INNER')[$column.Value.IsRequired -eq $true],
            $column.Value.Table, 
            ($column.Value.Name -replace "..$"), # odstrainm posledni dva znaky - Id
            $column.Value.Name,
            $tlbname)
    }
}
Add-Line('''')

# conditions
Add-Line('	-- Filtry')

foreach ($column in $data.Columns.GetEnumerator())
{  
    if ($column.Value.IsPk -eq $true -or $column.Value.IsFK -eq $true -or $allowedColumns.contains($column.Value.Name)) {

            Add-Line('	if @{0} is not null' -f  $column.Value.Name, $tlbname)
            Add-Line('	begin')

            # textovy rezezec
            if ($column.Value.Type -eq 'string') {
                Add-Line('		set @Filters += @AddFilter + ''([{1}].[{0}] like ''''%''''+ @{0} + ''''%'''')''' -f  $column.Value.Name, $tlbname)


            } else {
                Add-Line('		set @Filters += @AddFilter + ''([{1}].[{0}] = @{0})''' -f  $column.Value.Name, $tlbname)
            }
            
            Add-Line('		set @AddFilter = '' and ''')
            Add-Line('	end')
    }
}
Add-Line('')

# spojim filtry s sql
Add-Line('	if @Filters<>''''')
Add-Line('	begin')
Add-Line('		set @SQL = @SQL + ''WHERE 
'' + @Filters')
Add-Line('	end')
Add-Line('')


Add-Line('	-- print (@SQL)')
# spusteni procky
Add-Line('  EXEC sp_executesql @Sql, N''@LanguageId uniqueidentifier,')
Add-Line('    @RowCount int,')
# parametry
$isUsed = $true
foreach ($column in $data.Columns.GetEnumerator())
{  
    if ($column.Value.Name -like 'LanguageId') { 
        continue;
    }
    elseif ($column.Value.IsPk -eq $true -or $column.Value.IsFK -eq $true -or $allowedColumns.contains($column.Value.Name)) {
        $isUsed = $true
        Add-Line('    @{0} {1}{2},' -f 
                $column.Value.Name, 
                $column.Value.OriginalType, 
                ('',('('+$column.Value.TypeLength+')'))[($column.Value.OriginalType -like 'nvarchar')])
    }
}

if ($isUsed -eq $true) {
    Remove-LastChar
    Remove-LastChar
    Remove-LastChar
    Add-Line(''',')
    Add-Line('    @LanguageId=@LanguageId,')
    Add-Line('    @RowCount=@RowCount,')
}

# predani promennych
$isUsed = $true
foreach ($column in $data.Columns.GetEnumerator())
{  
    if ($column.Value.Name -like 'LanguageId') { 
        continue;
    }
    elseif ($column.Value.IsPk -eq $true -or $column.Value.IsFK -eq $true -or $allowedColumns.contains($column.Value.Name)) {
       $isUsed = $true
       Add-Line('    @{0} = @{0},' -f $column.Value.Name, $column.Value.OriginalType)
    }
}


if ($isUsed -eq $true) {
    Remove-LastChar
    Remove-LastChar
    Remove-LastChar
    Add-Line('')
}

Add-Line('')

Add-Line('END')

# vypisu builder do hostu
Out-Builder
