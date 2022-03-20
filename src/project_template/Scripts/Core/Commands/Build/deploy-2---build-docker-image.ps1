# Větev
$branch=$args[0]
if($args[0] -eq $null) {
  $branch="trunk"
}
else {
  $branch=$args[0]
}

# Cesta do rootu projektu
$reposPath = (Join-Path -Path (get-item (Get-Location)).Parent.Parent.Parent.Parent.Parent.fullname -ChildPath ("Repos")).Replace("\", "/").Replace("C:/", "")
$reposPathDocker = "/mnt/c/" + $reposPath + "/docker-compose.yml"
$reposPathCerts = "/mnt/c/" + $reposPath + "/docker/certs/geis-root-cert.crt"

# Docker build
wsl BRANCH=$branch docker-compose -f $reposPathDocker build

# Copy certificates
wsl sudo cp $reposPathCerts /usr/local/share/ca-certificates/

# Instal certificates
wsl sudo update-ca-certificates

# start docker
wsl BRANCH=$branch docker-compose -f $reposPathDocker up --detach   