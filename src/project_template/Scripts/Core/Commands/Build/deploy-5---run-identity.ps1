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
$reposPath = Join-Path -Path $rootFolder -ChildPath ("Repos")

dotnet run  --project $reposPath\Shared\trunk\IdentityServer\IdentityServer\IdentityServer.csproj