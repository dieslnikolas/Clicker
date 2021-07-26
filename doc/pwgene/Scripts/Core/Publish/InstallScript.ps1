param(
    [string] $path,
    [string] $publishFolder,
    [string] $framework,
    [string] $db_dir,
    [string] $script_original,
    [string] $script_azure
)


Write-Host ("FrameWork: " + $framework) 
Write-Host ("db_dir: " + $db_dir)
$relative = '\Addons\DbGenerator\bin\Release\DbGenerator.exe'
$generator = Join-Path $framework -ChildPath $relative
Write-Host ("Generator: " + $generator)

Write-Host "Generating install script..."
$proc = Start-Process -FilePath $generator -ArgumentList "Ideal", $db_dir -NoNewWindow -PassThru
$proc.WaitForExit()
Write-Host "Install script created"

Write-Host "Converting to Azure..."
New-Item -ItemType Directory -Force -Path $db_dir

$lookupTable = @{
    "TableColumn.COLUMN_NAME, @PrefixUrl" = "TableColumn.COLUMN_NAME collate SQL_Latin1_General_CP1_CI_AS, @PrefixUrl"
    "Ignore on Ignore.Value=sc.name" = "Ignore on Ignore.Value=sc.name collate SQL_Latin1_General_CP1_CI_AS"
    "st.name = @TableName" = "st.name collate SQL_Latin1_General_CP1_CI_AS = @TableName"
    "inner join sys.tables as tables on SF_EntityType.ID_Table=tables.name"="inner join sys.tables as tables on SF_EntityType.ID_Table=tables.name collate SQL_Latin1_General_CP1_CI_AS"
    "inner join sys.tables on sys0.tables.name=SF_Table.ID"="inner join sys.tables on sys.tables.name collate SQL_Latin1_General_CP1_CI_AS=SF_Table.ID"
    "sys.tables.name, 2"="sys.tables.name collate SQL_Latin1_General_CP1_CI_AS, 2"
    "left join SF_Table on sys.tables.name=SF_Table.ID"="left join SF_Table on sys.tables.name collate SQL_Latin1_General_CP1_CI_AS=SF_Table.ID"
    "left join SF_Table on SF_Table.ID=sys.tables.name"="left join SF_Table on SF_Table.ID=sys.tables.name collate SQL_Latin1_General_CP1_CI_AS"
    "sys.views.name="="sys.views.name collate SQL_Latin1_General_CP1_CI_AS="
    "inner join sys.tables on sys.tables.name=SF_Table.ID"="inner join sys.tables on sys.tables.name collate SQL_Latin1_General_CP1_CI_AS=SF_Table.ID"
    "sysobjects.name="="sysobjects.name collate SQL_Latin1_General_CP1_CI_AS="
    "sys.procedures.name="="sys.procedures.name collate SQL_Latin1_General_CP1_CI_AS="
    "sys.tables.name=SF_EmailType.ID_Table"="sys.tables.name collate SQL_Latin1_General_CP1_CI_AS=SF_EmailType.ID_Table"
    "sys.columns.name"="sys.columns.name collate SQL_Latin1_General_CP1_CI_AS"
}

Get-Content -Encoding UTF8 -Path $script_original | ForEach-Object {
    $line = $_

    $lookupTable.GetEnumerator() | ForEach-Object {
        if ($line -match $_.Key)
        {
            $line = $line -replace [regex]::Escape($_.Key), $_.Value
        }
    }
$line
} | Set-Content -Encoding UTF8 -Path $script_azure

Write-Host "Azure script created"

Copy-Item -Path "$path\Db\*.sql" -Destination "$publishFolder"

Write-Host "Press enter to continue..."
Read-Host