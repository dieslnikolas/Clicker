# Větev
$branch=$args[0]
if($args[0] -eq $null) {
  $branch="trunk"
}
else {
  $branch=$args[0]
}

# zda se pracuje pres clicker (mam tam vynuceni ukoncovani, jinak dotnet bezi do nekonecna a vyzira pamet)
if ($null -ne $args[1])
{
    $isClicker = $true
}

# Cesta do rootu projektu
$rootFolder = (get-item (Get-Location)).Parent.Parent.Parent.Parent.Parent.fullname ## You didn't saw that
$projectPath = Join-Path -Path $rootFolder -ChildPath ("Repos\IT2021\{0}" -f $branch)
$reposPath = Join-Path -Path $rootFolder -ChildPath ("Repos")

Write-Host ""
Write-Host "############# 1/4 Copying .Nuget File  #############"
$nugetFile = Get-Item -Path resources\NuGet.config
$nugetFile.IsReadOnly = $false
Copy-Item  $nugetFile -Destination $projectPath\.nuget -Force

# SHARED
Write-Host "############# 2/4 Regen Shared Nswag #############"

Write-Host "############# 3/4 Shared Services   #############"
(Get-Item -Path $reposPath\Shared\trunk\EmailSender.ApiClient\EmailSender.ApiClient.nswag.json).IsReadOnly = $false
(Get-Item -Path $reposPath\Shared\trunk\EmailSender.ApiClient\EmailSender.ApiClient.Generated.cs).IsReadOnly = $false
nswag run $reposPath\Shared\trunk\EmailSender.ApiClient\EmailSender.ApiClient.nswag /runtime:NetCore31
Write-Host Done


# # LOCAL
Write-Host "############# 4/4 Regen Local Nswag #############"

Write-Host "CodelistDataService"
(Get-Item -Path $projectPath\IT2021.CodelistDataService.ApiClient\IT2021.CodelistDataService.ApiClient.nswag.json).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.CodelistDataService.ApiClient\IT2021.CodelistDataService.ApiClient.Generated.cs).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.CodelistDataService.ApiClient.Advanced\IT2021.CodelistDataService.ApiClient.Advanced.nswag.json).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.CodelistDataService.ApiClient.Advanced\IT2021.CodelistDataService.ApiClient.Advanced.Generated.cs).IsReadOnly = $false
nswag run $projectPath\IT2021.CodelistDataService.ApiClient\IT2021.CodelistDataService.ApiClient.nswag /runtime:NetCore31 
nswag run $projectPath\IT2021.CodelistDataService.ApiClient.Advanced\IT2021.CodelistDataService.ApiClient.Advanced.nswag /runtime:NetCore31

Write-Host "OperationalDataService"
(Get-Item -Path $projectPath\IT2021.OperationalDataService\IT2021.OperationalDataService.xml).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.Operational.BusinessLayer\IT2021.OperationalDataService.xml).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.Operational.DataLayer\Migrations\IT2021DbContextModelSnapshot.cs).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.OperationalDataService.ApiClient\IT2021.OperationalDataService.ApiClient.Generated.cs).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.OperationalDataService.ApiClient\IT2021.OperationalDataService.ApiClient.nswag.json).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.OperationalDataService.ApiClient.Advanced\IT2021.OperationalDataService.ApiClient.Advanced.nswag.json).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.OperationalDataService.ApiClient.Advanced\IT2021.OperationalDataService.ApiClient.Advanced.Generated.cs).IsReadOnly = $false
nswag run $projectPath\IT2021.OperationalDataService.ApiClient\IT2021.OperationalDataService.ApiClient.nswag /runtime:NetCore31
nswag run $projectPath\IT2021.OperationalDataService.ApiClient.Advanced\IT2021.OperationalDataService.ApiClient.Advanced.nswag /runtime:NetCore31

Write-Host "SaleDataService"
(Get-Item -Path $projectPath\IT2021.SaleDataService.ApiClient\IT2021.SaleDataService.ApiClient.nswag.json).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.SaleDataService.ApiClient\IT2021.SaleDataService.ApiClient.Generated.cs).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.SaleDataService.ApiClient.Advanced\IT2021.SaleDataService.ApiClient.Advanced.nswag.json).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.SaleDataService.ApiClient.Advanced\IT2021.SaleDataService.ApiClient.Advanced.Generated.cs).IsReadOnly = $false
nswag run $projectPath\IT2021.SaleDataService.ApiClient\IT2021.SaleDataService.ApiClient.nswag /runtime:NetCore31
nswag run $projectPath\IT2021.SaleDataService.ApiClient.Advanced\IT2021.SaleDataService.ApiClient.Advanced.nswag /runtime:NetCore31

Write-Host "All done"

if ($isClicker) {
    [Environment]::Exit(0) # make sure it will end cleanly
}