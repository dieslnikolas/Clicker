# file sits in C:\Users\diesl\Developing\src\Geis\_pwgen\Scripts\Global\Commands\UnblockWinnat.ps1
# data are accessible via script bellow:
#

param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

net stop winnat
net start winnat