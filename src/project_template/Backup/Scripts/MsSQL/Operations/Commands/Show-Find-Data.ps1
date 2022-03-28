param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

# connString
$conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
$conn.Open()

[void][Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic')

$title = 'Hledání'
$msg   = 'Doplò hledaný text'
$defaultResponse = 'ID_User'

$name  = [Microsoft.VisualBasic.Interaction]::InputBox($msg, $title, $defaultResponse)
if ([string]::IsNullOrEmpty($name) -eq $false) 
{
    $items = New-Object System.Collections.Generic.List[System.Object]

    ## query & cmd
    $q = (Get-Content .\Scripts\MsSQL\Operations\SQL\Show-Find-Data.sql -Encoding UTF8) -join "`n"
    $cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
    $cmd.Parameters.AddWithValue('@name', $name) | Out-Null
    $reader = $cmd.ExecuteReader() 

    while ($reader.Read()) {
        $item = [pscustomobject]@{
            Name = $reader['Name']
            Type = $reader['Type']
            Date = $reader['Date']
        }
        $items.Add($item)
    }

    $reader.Close()
    $conn.Close() 

    $temp = $items | Out-GridView -Title "Results" -PassThru

    ## open
    if ($temp -ne $null) {
        foreach ($tmp in $temp) {      

            $data.ProcessItem = @{
                $tmp.Name = @{
                  Name = $tmp.Name 
                }
            }

            switch ($tmp.Type) {
                'Table' 
                {
                    Write-Host 'Table'
                    $data | .\Scripts\mssql\Tables\Commands\Show-Table-Detail.ps1
                }
                'View' 
                {
                    $data | .\Scripts\mssql\Views\Commands\Show-View-Detail.ps1
                }
                'Procedure' 
                {
                    $data | .\Scripts\mssql\Procedures\Commands\Show-Procedure-Detail.ps1
                }
                'Function' 
                {
                    $data | .\Scripts\mssql\Functions\Commands\Show-Function-Detail.ps1
                }
            }
        }
    }
}

# vratim data
$data