# file sits in C:\Users\diesl\Developing\src\Geis\_pwgen\Scripts\Global\Commands\UnblockWinnat.ps1
# data are accessible via script bellow:
#

param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

# get branch name
$branch = $data.Metadata.Branch

# set new working directory
$oldLocation = Get-Location
Set-Location -Path "Scripts/Core/Commands/Build/"
Get-Location

# run script
./deploy-3---register-certs.ps1 $branch $true

# return old location
Set-Location -Path $oldLocation 
Get-Location

exit