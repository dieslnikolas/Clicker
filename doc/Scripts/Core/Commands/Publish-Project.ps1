param (
    [Parameter(ValueFromPipeline = $true)]$data = $null
)

#$projectsRootPath = "C:\Developing\Framework\Applications"
$projectsRootPath = "C:\prace\repository\framework\Applications"
$projectName = $data.Metadata.ProjectName
$appNamespace = $data.Metadata.AppNamespace
$appName = $data.Metadata.AppProjectName

$path = (get-item (Get-Location)).parent.fullname
$today = "{0:yyyy-MM-dd}" -f (get-date)

$installFolderPath = Join-Path "c:\Instalace\" -ChildPath $projectName
$installFolderPath = Join-Path $installFolderPath -ChildPath (Get-Date).tostring(“yyyy-MM-dd”) 

function EditPublishFile($profileXmlFile, $profileInstallDir) {
    Set-ItemProperty -Path $profileXmlFile -Name IsReadOnly -Value $false
    [xml]$profileXml = Get-Content $profileXmlFile
    $profileXml.Project.PropertyGroup.publishUrl = $profileInstallDir.ToString()
    $profileXml.Save($profileXmlFile)
}

# import modulu pro MsBuild
If (!(Get-module Invoke-MsBuild)) {
    Import-Module .\Scripts\modules\Invoke-MsBuild\Invoke-MsBuild.psm1
}

# promenne
$csprojFile = $null # cesty k csproj souboru
$profileFile = $null # cesty k profilu
$buildParams = $null # parametry
$publishFolder = $null # cesta k publish slozce

# CLEAR
if (Test-Path -path $installFolderPath) {
    Write-Host "Clear install folder"
    Remove-Item –path $installFolderPath -Recurse -Force
}

# ## WEB
# $part = "Ideal"
# # editace publish XML a zalozeni publish slozky
# $publishFolder = (Join-Path -Path $installFolderPath -ChildPath $part)
# New-Item -ItemType Directory -Force -Path $publishFolder
# $profileFile = Join-Path -Path $path -ChildPath ("{0}\Properties\PublishProfiles\{0}.pubxml" -f $appName, $projectName, $part)
# EditPublishFile $profileFile $publishFolder

# # cesta k csproj
# $csprojFile = Join-Path -Path $path -ChildPath ("{0}\{0}.csproj" -f $appName)
# # sestaveni parametru pro build
# $buildParams = "/p:DeployOnBuild=true /p:PublishProfile=""{0}"" /property:Configuration=Release" -f $profileFile

# $build = (Invoke-MsBuild -Path $csprojFile -MsBuildParameters "$buildParams" -ShowBuildOutputInCurrentWindow -KeepBuildLogOnSuccessfulBuilds -AutoLaunchBuildErrorsLogOnFailure)
# if ($build.BuildSucceeded -eq $true) {
#     Write-Output "Build webu proběhl v pořádku."
# }

# # upravit koncovky u configu na *.clear
# Get-ChildItem -Path $publishFolder -Filter *.config | Rename-Item -NewName { $_.name -Replace '\.config$','.config.clear' } -Force

# ## end - WEB

## DB

$publishFolder = (Join-Path -Path $installFolderPath -ChildPath "Db")
New-Item -ItemType Directory -Force -Path $publishFolder

$framework = Split-Path $path
$framework = Split-Path $framework


$original_file = "Ideal_Install.sql"
$destination_file = "Ideal_Install_Azure.sql"

$db_dir = "{0}\Db" -f $installFolderPath
$script_original = "{0}\{1}" -f $db_dir, $original_file
$script_azure = "{0}\{1}" -f $db_dir, $destination_file

$generate_new = $true
if (Test-Path $script_original){
    # Generate new ?
    $answer = new-object -comobject wscript.shell 
    $intAnswer = $answer.popup("Do you want to overwrite the old install script?", 0,"Generate", 4) 
    If ($intAnswer -eq 6) { 
        #$answer.popup("You answered yes.")
        $generate_new = $true
    } else { 
        #$answer.popup("You answered no.")
        $generate_new = $false
    } 
}

# $scriptBlock = {
#     Write-Host "OPEN"
#     Read-Host
# }

# # Start a new instance of Windows PowerShell and run the script
# $process = Start-Process powershell.exe -NoNewWindow -ArgumentList ($scriptBlock) -PassThru
# $process.WaitForExit()

# Write-Host "Done"
# Read-Host


if($generate_new){
    if (Test-Path $script_original){
        Remove-Item –path $script_original
    }
    if (Test-Path $script_azure){
        Remove-Item –path $script_azure
    }
    
    $installScriptPath = $projectsRootPath + "\Ideal\db\Scripts\Core\Publish\InstallScript.ps1"
    $argumentInstall = "{0} -framework {1} -db_dir {2} -script_original {3} -script_azure {4} -path {5} -publishFolder {6}" -f $installScriptPath, $framework, $db_dir, $script_original, $script_azure, $path, $publishFolder

    # Start a new instance of Windows PowerShell and run the script
    $process = Start-Process powershell.exe -Argument $argumentInstall #-PassThru
    
    #$process.WaitForExit()

}else{
    "New install script was NOT created"
}

## end - DB

## ZIP

$answer = new-object -comobject wscript.shell 
$intAnswer = $answer.popup("Do you want to copy the project?", 0,"Generate", 4) 
If ($intAnswer -eq 6) { 
    #$answer.popup("You answered yes.")
    
    $copyScriptPath = $projectsRootPath + "\Ideal\db\Scripts\Core\Publish\CopyScript.ps1"
    $sourceProject = $projectsRootPath + "\Ideal"
    $argumentCopy = "{0} -source {1} -target {2}" -f $copyScriptPath, $sourceProject, $installFolderPath
    $process = Start-Process powershell.exe -Argument $argumentCopy
    
    # $zipFile = "{0}\{1}.zip" -f $installFolderPath, ((Get-Item $installFolderPath).Name)
    # Compress-Archive -Path "$installFolderPath*" -DestinationPath "$zipFile"
}

## end - ZIP

## Open
Invoke-Item $installFolderPath