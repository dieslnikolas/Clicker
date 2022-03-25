param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)
​
$debug = $true
​
Add-Type -AssemblyName Microsoft.VisualBasic

function Read-MultiLineInputBoxDialog([string]$Message, [string]$WindowTitle, [string]$DefaultText)
{
<#
    .SYNOPSIS
    Prompts the user with a multi-line input box and returns the text they enter, or null if they cancelled the prompt.

    .DESCRIPTION
    Prompts the user with a multi-line input box and returns the text they enter, or null if they cancelled the prompt.

    .PARAMETER Message
    The message to display to the user explaining what text we are asking them to enter.

    .PARAMETER WindowTitle
    The text to display on the prompt window's title.

    .PARAMETER DefaultText
    The default text to show in the input box.

    .EXAMPLE
    $userText = Read-MultiLineInputDialog "Input some text please:" "Get User's Input"

    Shows how to create a simple prompt to get mutli-line input from a user.

    .EXAMPLE
    # Setup the default multi-line address to fill the input box with.
    $defaultAddress = @'
    John Doe
    123 St.
    Some Town, SK, Canada
    A1B 2C3
    '@

    $address = Read-MultiLineInputDialog "Please enter your full address, including name, street, city, and postal code:" "Get User's Address" $defaultAddress
    if ($address -eq $null)
    {
        Write-Error "You pressed the Cancel button on the multi-line input box."
    }

    Prompts the user for their address and stores it in a variable, pre-filling the input box with a default multi-line address.
    If the user pressed the Cancel button an error is written to the console.

    .EXAMPLE
    $inputText = Read-MultiLineInputDialog -Message "If you have a really long message you can break it apart`nover two lines with the powershell newline character:" -WindowTitle "Window Title" -DefaultText "Default text for the input box."

    Shows how to break the second parameter (Message) up onto two lines using the powershell newline character (`n).
    If you break the message up into more than two lines the extra lines will be hidden behind or show ontop of the TextBox.

    .NOTES
    Name: Show-MultiLineInputDialog
    Author: Daniel Schroeder (originally based on the code shown at http://technet.microsoft.com/en-us/library/ff730941.aspx)
    Version: 1.0
#>
    Add-Type -AssemblyName System.Drawing
    Add-Type -AssemblyName System.Windows.Forms

    # Create the Label.
    $label = New-Object System.Windows.Forms.Label
    $label.Location = New-Object System.Drawing.Size(10,10)
    $label.Size = New-Object System.Drawing.Size(280,20)
    $label.AutoSize = $true
    $label.Text = $Message

    # Create the TextBox used to capture the user's text.
    $textBox = New-Object System.Windows.Forms.TextBox
    $textBox.Location = New-Object System.Drawing.Size(10,40)
    $textBox.Size = New-Object System.Drawing.Size(575,200)
    $textBox.AcceptsReturn = $true
    $textBox.AcceptsTab = $false
    $textBox.Multiline = $true
    $textBox.ScrollBars = 'Both'
    $textBox.Text = $DefaultText

    # Create the OK button.
    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Location = New-Object System.Drawing.Size(415,250)
    $okButton.Size = New-Object System.Drawing.Size(75,25)
    $okButton.Text = "OK"
    $okButton.Add_Click({ $form.Tag = $textBox.Text; $form.Close() })

    # Create the Cancel button.
    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Location = New-Object System.Drawing.Size(510,250)
    $cancelButton.Size = New-Object System.Drawing.Size(75,25)
    $cancelButton.Text = "Cancel"
    $cancelButton.Add_Click({ $form.Tag = $null; $form.Close() })

    # Create the form.
    $form = New-Object System.Windows.Forms.Form
    $form.Text = $WindowTitle
    $form.Size = New-Object System.Drawing.Size(610,320)
    $form.FormBorderStyle = 'FixedSingle'
    $form.StartPosition = "CenterScreen"
    $form.AutoSizeMode = 'GrowAndShrink'
    $form.Topmost = $True
    $form.AcceptButton = $okButton
    $form.CancelButton = $cancelButton
    $form.ShowInTaskbar = $true

    # Add all of the controls to the form.
    $form.Controls.Add($label)
    $form.Controls.Add($textBox)
    $form.Controls.Add($okButton)
    $form.Controls.Add($cancelButton)

    # Initialize and show the form.
    $form.Add_Shown({$form.Activate()})
    $form.ShowDialog() > $null  # Trash the text of the button that was clicked.

    # Return the text that the user entered.
    return $form.Tag
}​

# $text = [Microsoft.VisualBasic.Interaction]::InputBox('Exec command:', 'Procedure call')
$text = Read-MultiLineInputBoxDialog -Message "Enter procedure call" -WindowTitle "Procedure call"

if($text.Length -eq 0){
    return
}
​
# Get procedure
$procRes = Select-String "^(?:exec )?(.*?)( |$)" -InputObject $text -AllMatches
# $text -match "exec (.*?) "
# $procedure = $procRes.Matches
$procedure = $procRes.Matches[0].Groups[1].Value
​
​
# Get parameters
$res = Select-String "(@ID(?:.*?))=(.*?)(,| |$)" -InputObject $text -AllMatches
$paramDict = @{}
​
foreach($param in $res.Matches){
    $paramDict[$param.Groups[1].Value] = $param.Groups[2].Value
}
​
​
if($debug){
    "Input: " + $text
    "Procedure: " + $procedure
    
    foreach($param in $res.Matches){
        "Parameter: " + $param.Groups[1].Value + " : " + $param.Groups[2].Value
    }
}
​
if($procedure -eq 0){
    return
}
​
# connString
$conn = new-object System.Data.SqlClient.SqlConnection $data.Metadata.ConnectionString
$conn.Open()
​
​
## inputParams
$q = "SELECT PARAMETER_NAME, DATA_TYPE, PARAMETER_MODE, CHARACTER_MAXIMUM_LENGTH
                        FROM INFORMATION_SCHEMA.PARAMETERS
                        where SPECIFIC_NAME=@ProcName
                        order by ORDINAL_POSITION"
​
$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@ProcName', $procedure) | Out-Null
$reader = $cmd.ExecuteReader() 
​
$sets = ""
while ($reader.Read()){
    $item = New-Object System.Object 
​
    $item | Add-Member -MemberType NoteProperty -Name "Name" -Value $reader['PARAMETER_NAME']
    $item | Add-Member -MemberType NoteProperty -Name "Type" -Value $reader['DATA_TYPE']
    $item | Add-Member -MemberType NoteProperty -Name "Mode" -Value $reader['PARAMETER_MODE']
    $item | Add-Member -MemberType NoteProperty -Name "Length" -Value $reader['CHARACTER_MAXIMUM_LENGTH']
​
    if($paramDict[$item.Name]){
        $declaration += "set " + $item.Name + " = " + $paramDict[$item.Name] + "`r`n"
    }
    # $declaration += "`r`n" + $item.Name + " " + $type + " = " + $paramDict[$item.Name] + ","
}
$sets = $declaration #.Substring(0,$declaration.Length -1) # Remove last ','
$reader.Close()
​
​
Write-Host $procedure
​
## query & cmd
$q = "
select sys.sql_modules.definition from sysobjects 
left join sys.sql_modules on sys.sql_modules.object_id = sysobjects.id
where name = @name
"
​
$cmd = new-object System.Data.SqlClient.SqlCommand($q, $conn)
$cmd.Parameters.AddWithValue('@name', $procedure) | Out-Null
$reader = $cmd.ExecuteReader() 
​
if ($reader.Read()) {
    # save definition to temp
    $definition = $reader['definition']
​
    $regex = Select-String "(?:CREATE|ALTER)(?:.?)*\n((?:.|\n)*?\n)(?:AS)((.|\n)*)" -InputObject $definition -AllMatches
    $declare = $regex.Matches[0].Groups[1].Value
    $body = $regex.Matches[0].Groups[2].Value
​
    $head = "/* `r`n" + $text + "`r`n */ `r`n"
    $declare = "declare `r`n" + $declare + "`r`n" # hotfix regexu pridanim `n k $declare
    $body = "`r`n ------------- Body ------------- `r`n" + $body
    $body = $body.replace('return 0','-- return 0')
    $body = $body.replace('return 1','-- return 1')
    $body = $body.replace('raiserror (@Message, 16, 1)','-- raiserror (@Message, 16, 1)')
​
    if($debug){
        "Declare: "
        $declare
​
        "Sets:"
        $sets
    }
    
    # $test = "select 1111" + "`n"
    $result = $head + $declare + $sets + $body
    # $result = "{0} `r`n {1} return 1" -f $originalDeclaration, $sets
    
    $filename = $procedure + "_call.sql"
    $path = Join-Path -Path $env:temp -ChildPath "$($filename)"
    Remove-Item -Path $path
    # $result | Out-File -filepath $path
    Out-File -filepath $path -InputObject $result
    # and run
    # Set-Clipboard -Value $result
    Start-Process -filepath $path
}else{
    "Definnition not loaded"
}
​
$reader.Close()
$conn.Close() 
​
#$data | ConvertTo-Json -Depth 5 -Compress # | $dataString #  > "data.json"
$data