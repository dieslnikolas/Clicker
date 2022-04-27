param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

$projectName = $data.Metadata.ProjectName
$appNamespace = $data.Metadata.AppNamespace
$apiNamespace = $data.Metadata.AppNamespace + "Api"
$serviceNamespace = 'IsPrecontrol.Service'

$path = (get-item (Get-Location)).parent.fullname

# import modulu pro MsBuild
If (!(Get-module Invoke-MsBuild)) {
    Import-Module .\Scripts\modules\Invoke-MsBuild\Invoke-MsBuild.psm1
}
 
[void][Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic')

$title = 'Verze'
$msg   = 'Dopln novou verzi aplikace'
$defaultResponse = '1.0.0.*'

$fullVersion  = [Microsoft.VisualBasic.Interaction]::InputBox($msg, $title, $defaultResponse)

$assemblyInfos = @(
    "IsPrecontrol.Core\Properties\AssemblyInfo.cs",
    "IsPrecontrol.Service\Properties\AssemblyInfo.cs",
    "IsPrecontrol.Web\Properties\AssemblyInfo.cs",
    "IsPrecontrol.WebApi\Properties\AssemblyInfo.cs"
);

Foreach ($configpath in $assemblyInfos) {
    $p = Join-Path -Path $path -ChildPath $configpath
    (Get-Content -Path ($p)) | ForEach-Object {
        % {$_ -replace ('\[assembly: AssemblyVersion\("([0-9]+).([0-9]+).([0-9]+)([^"]*)"\)\]'), ('[assembly: AssemblyVersion("' + $fullVersion + '")]') }
    } | Set-Content -Path ($p)

}

$coreProjects = @(
);

Foreach ($configpath in $coreProjects) {
    $p = Join-Path -Path $path -ChildPath $configpath
    (Get-Content -Path ($p)) | ForEach-Object {
        % {$_ -replace ('<AssemblyVersion>([0-9]+).([0-9]+).([0-9]+)([^"]*)</AssemblyVersion>'), ('<AssemblyVersion>' + $fullVersion + '</AssemblyVersion>') }
    } | Set-Content -Path ($p)

}