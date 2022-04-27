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

Write-Host "############# 1/6 Preparing data   #############"
# Cesta do rootu projektu
$reposPath = (Join-Path -Path (get-item (Get-Location)).Parent.Parent.Parent.Parent.Parent.fullname -ChildPath ("Repos")).Replace("\", "/").Replace("C:/", "")
$reposPathDocker = "/mnt/c/" + $reposPath + "/docker-compose.yml"
$reposPathCerts = "/mnt/c/" + $reposPath + "/docker/certs/geis-root-cert.crt"

Write-Host "############# 2/6 Deleting old containers   #############"
# Docker Reset
wsl BRANCH=$branch docker rm -f codelistdataservice
wsl BRANCH=$branch docker rm -f operationaldataservice
wsl BRANCH=$branch docker rm -f saledataservice

Write-Host "############# 3/6 Building docker   #############"
# Docker build
wsl BRANCH=$branch docker-compose -f $reposPathDocker build

Write-Host "############# 4/6 Copying certs   #############"
# Copy certificates
wsl sudo cp $reposPathCerts /usr/local/share/ca-certificates/

Write-Host "############# 5/6 Updating certs   #############"
# Instal certificates
wsl sudo update-ca-certificates

Write-Host "############# 6/6 Starting detached docker   #############"
# start docker
wsl BRANCH=$branch docker-compose -f $reposPathDocker up --detach

if ($isClicker) {
    [Environment]::Exit(0) # make sure it will end cleanly
}