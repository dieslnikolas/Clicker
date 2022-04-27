# Větev
$branch=$args[0]
if($args[0] -eq $null) {
  $branch="trunk"
}
else {
  $branch=$args[0]
}

# zda se pracuje pres clicker (mam tam vynuceni ukoncovani, jinak dotnet bezi do nekonecna a vyzira pamet)
$isClicker = $null -ne $args[1] ? $true : $false;

# Cesta do rootu projektu
$rootFolder = (get-item (Get-Location)).Parent.Parent.Parent.Parent.Parent.fullname ## You didn't saw that
$reposPath = Join-Path -Path $rootFolder -ChildPath ("Repos")

Write-Host "############# 1/2 Strting Identity Server  #############"
dotnet run  --project $reposPath\Shared\trunk\IdentityServer\IdentityServer\IdentityServer.csproj
Write-Host "############# 2/2 Identity is running  #############"

if ($isClicker) {
    [Environment]::Exit(0) # make sure it will end cleanly
}