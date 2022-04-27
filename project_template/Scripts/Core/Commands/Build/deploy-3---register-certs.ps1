# zda se pracuje pres clicker (mam tam vynuceni ukoncovani, jinak dotnet bezi do nekonecna a vyzira pamet)
if ($null -ne $args[1])
{
    $isClicker = $true
}

Write-Host "############# 1/9 Instaling certs to rabbitmq   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("rabbitmq") -eq $true)
{
    docker exec -it rabbitmq ./scripts/init.sh
    docker commit rabbitmq
}
  
Write-Host "############# 2/9 Instaling certs to codelistdataservice   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("codelistdataservice") -eq $true)
{
    docker exec -it codelistdataservice /bin/bash "../https/register.sh"
    docker commit codelistdataservice
}

Write-Host "############# 3/9 Instaling certs to emailsender   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("emailsender") -eq $true)
{
    docker exec -it emailsender /bin/bash "../https/register.sh"
    docker commit emailsender
}

Write-Host "############# 4/9 Instaling certs to identityserver   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("identityserver") -eq $true)
{
    docker exec -it identityserver /bin/bash "../https/register.sh"
    docker commit identityserver
}

Write-Host "############# 5/9 Instaling certs to operationaldataservice   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("operationaldataservice") -eq $true)
{
    docker exec -it operationaldataservice /bin/bash "../https/register.sh"
    docker commit operationaldataservice
}

Write-Host "############# 6/9 Instaling certs to saledataservice   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("saledataservice") -eq $true)
{
    docker exec -it saledataservice /bin/bash "../https/register.sh"
    docker commit saledataservice
}

Write-Host "############# 7/9 Instaling certs to uiservice   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("uiservice") -eq $true)
{
    docker exec -it uiservice /bin/bash "../https/register.sh"
    docker commit uiservice
}

Write-Host "############# 8/9 Instaling certs to actioncenterdataservice   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("actioncenterdataservice") -eq $true)
{
    docker exec -it actioncenterdataservice /bin/bash "../https/register.sh"
    docker commit actioncenterdataservice
}

Write-Host "############# 9/9 Instaling certs to cdreplqueuesenderservice   #############"
if ((docker container ls -a --format "table {{.Names}}").Contains("cdreplqueuesenderservice") -eq $true)
{
    docker exec -it cdreplqueuesenderservice /bin/bash "../https/register.sh"
    docker commit cdreplqueuesenderservice
}

if ($isClicker) {
    [Environment]::Exit(0) # make sure it will end cleanly
}