# file sits in C:\Users\diesl\Developing\src\Dieslnikolas\Clicker\src\project_template\Scripts\Global\Commands\powershell.ps1
# data are accessible via script bellow:
#

param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

$data