# Větev
$branch=$args[0]
if($args[0] -eq $null) {
  $branch="trunk"
}
else {
  $branch=$args[0]
}

# Cesta do rootu projektu
$rootFolder = (get-item (Get-Location)).Parent.Parent.Parent.Parent.Parent.fullname ## You didn't saw that
$projectPath = Join-Path -Path $rootFolder -ChildPath ("Repos\IT2021\{0}" -f $branch)
$reposPath = Join-Path -Path $rootFolder -ChildPath ("Repos")

Write-Host ""
Write-Host "############# Copying .Nuget File  #############"
$nugetFile = Get-Item -Path resources\NuGet.config
$nugetFile.IsReadOnly = $false
Copy-Item  $nugetFile -Destination $projectPath\.nuget -Force

Write-Host "############# DONT FORGET TO TURN ON DB"
$reposPathD = (Join-Path -Path (get-item (Get-Location)).Parent.Parent.Parent.Parent.Parent.fullname -ChildPath ("Repos")).Replace("\", "/").Replace("C:/", "")
$reposPathDocker = "/mnt/c/" + $reposPathD + "/docker-compose.yml"
wsl BRANCH=$branch docker-compose -f $reposPathDocker up db --detach 

Write-Host "############# Deploying Shared  #############"

# nasadi Shared projekty a zmigruje databazy
# instalacia EF tools:
# dotnet tool install --global dotnet-ef

Write-Host "#############  SHARED - Deploying IdentityServer   #############"
dotnet restore $reposPath\Shared\trunk\IdentityServer -s http://ejpsrvtfs01.geis.cz:8210/nuget -s https://api.nuget.org/v3/index.json
dotnet publish $reposPath\Shared\trunk\IdentityServer -c Debug -f netcoreapp3.1 -r win10-x64 --self-contained false -o C:\inetpub\IdentityServer
dotnet ef database update -p $reposPath\Shared\trunk\IdentityServer\IdentityServer

Write-Host "#############  SHARED -  Deploying EmailSender   #############"
dotnet restore $reposPath\Shared\trunk\EmailSender -s http://ejpsrvtfs01.geis.cz:8210/nuget -s https://api.nuget.org/v3/index.json
dotnet publish $reposPath\Shared\trunk\EmailSender -c Debug -f netcoreapp3.1 -r win10-x64 --self-contained false -o C:\inetpub\EmailSenderService
dotnet ef database update -p $reposPath\Shared\trunk\EmailSender\EmailSender

Write-Host "#############  SHARED -  Deploying Geis.Ui.Service   #############"
dotnet restore $reposPath\Shared\trunk\Geis.Ui.Service -s http://ejpsrvtfs01.geis.cz:8210/nuget -s https://api.nuget.org/v3/index.json
dotnet publish $reposPath\Shared\trunk\Geis.Ui.Service -c Debug -f netcoreapp3.1 -r win10-x64 --self-contained false -o C:\inetpub\GeisUiService
dotnet ef database update -p $reposPath\Shared\trunk\Geis.Ui.Service\Geis.Ui.Service

Write-Host ""
Write-Host ""
Write-Host ""
Write-Host ""
   
Write-Host "#############  Deploying IT2021   #############"

Write-Host "############# LOCAL -  Deploying DocumentDataService   #############"
# (Get-Item -Path $projectPat\IT2021.DocumentDataService\IT2021.DocumentDataService.xml).IsReadOnly = $false

Write-Host "############# LOCAL -  Deploying CodelistDataService   #############"
(Get-Item -Path $projectPath\IT2021.CodelistDataService\IT2021.CodelistDataService.xml).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.DocumentDataLayer\Migrations\IT2021DbContextModelSnapshot.cs).IsReadOnly = $false
dotnet restore $projectPath\IT2021.CodelistDataService -s http://ejpsrvtfs01.geis.cz:8210/nuget -s https://api.nuget.org/v3/index.json
dotnet publish $projectPath\IT2021.CodelistDataService -c Debug -f netcoreapp3.1 -r win10-x64 --self-contained false -o C:\inetpub\CodelistDataService /p:WarningLevel=0
dotnet ef database update -p $projectPath\IT2021.CodelistDataService

Write-Host "#############  LOCAL -  Deploying OperationalDataService   #############"
(Get-Item -Path $projectPath\IT2021.OperationalDataService\IT2021.OperationalDataService.xml).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.OperationalDataLayer\Migrations\IT2021DbContextModelSnapshot.cs).IsReadOnly = $false
dotnet restore $projectPath\IT2021.OperationalDataService -s http://ejpsrvtfs01.geis.cz:8210/nuget -s https://api.nuget.org/v3/index.json
dotnet publish $projectPath\IT2021.OperationalDataService -c Debug -f netcoreapp3.1 -r win10-x64 --self-contained false -o C:\inetpub\OperationalDataService /p:WarningLevel=0
dotnet ef database update -p $projectPath\IT2021.OperationalDataService

Write-Host "#############  LOCAL -  Deploying IT2021.SaleDataService   #############"
# (Get-Item -Path $projectPath\IT2021.SaleDataService\IT2021.SaleDataService.xml).IsReadOnly = $false
(Get-Item -Path $projectPath\IT2021.SaleDataLayer\Migrations\IT2021DbContextModelSnapshot.cs).IsReadOnly = $false
dotnet restore $projectPath\IT2021.SaleDataService -s http://ejpsrvtfs01.geis.cz:8210/nuget -s https://api.nuget.org/v3/index.json
dotnet publish $projectPath\IT2021.SaleDataService -c Debug -f netcoreapp3.1 -r win10-x64 --self-contained false -o C:\inetpub\SaleDataService /p:WarningLevel=0
dotnet ef database update -p $projectPath\IT2021.SaleDataService

Write-Host "DONE!"