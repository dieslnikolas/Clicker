If (!(Get-module Powergene)) {
    Import-Module .\Scripts\modules\Powergene\Powergene.psm1
}

# default encoding for Out-File 
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['Get-Content:Encoding'] = 'utf8'