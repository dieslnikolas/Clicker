# Start-Process -FilePath "code" -ArgumentList "."  -NoNewWindow

$original_file = "Ideal_Install.sql"
$destination_file = "Ideal_Install_Azure.sql"

$project_name = "Ideal"
$installations = "c:\Instalace"
$db_generator = "c:\Developing\Framework\Addons\DbGenerator\bin\Release\DbGenerator.exe"

$today = "{0:yyyy-MM-dd}" -f (get-date)
$db_dir = "{0}\{1}\{2}\Db" -f $installations, $project_name, $today
$script_original = "{0}\{1}" -f $db_dir, $original_file
$script_azure = "{0}\{1}" -f $db_dir, $destination_file


if ((Test-Path $script_original) -eq $true){
   # Overwrite ?
   $answer = new-object -comobject wscript.shell 
   $intAnswer = $answer.popup("Do you want to overwrite the existing install script?", 0,"Install script", 4) 
   If ($intAnswer -eq 6) { 
       # $answer.popup("You answered yes.") 
        Remove-Item –path $script_original
        Remove-Item –path $script_azure
   } else { 
       # $answer.popup("You answered no.") 
   }
}

New-Item -ItemType Directory -Force -Path $db_dir

if((Test-Path $script_original) -eq $false){
    #"Generating install script..."
    $generator = Start-Process -FilePath $db_generator -WindowStyle hidden -PassThru -ArgumentList "Ideal", $db_dir
    $generator.WaitForExit()
    "Instal script created in {0}" -f $script_original
}

if((Test-Path $script_azure) -eq $false){
    "Converting install script for Azure..."

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
    
    Get-Content -Encoding UTF8 -Path $source_script | ForEach-Object {
        $line = $_
    
        $lookupTable.GetEnumerator() | ForEach-Object {
            if ($line -match $_.Key)
            {
                $line = $line -replace [regex]::Escape($_.Key), $_.Value
            }
        }
       $line
    } | Set-Content -Encoding UTF8 -Path $target_script

    "Instal script converted in {0}" -f $script_azure
}


