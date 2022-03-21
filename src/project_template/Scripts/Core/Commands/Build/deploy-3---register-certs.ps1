if ((docker container ls -a --format "table {{.Names}}").Contains("rabbitmq") -eq $true)
{
    docker exec -it rabbitmq ./scripts/init.sh
    docker commit rabbitmq
}
  
if ((docker container ls -a --format "table {{.Names}}").Contains("codelistdataservice") -eq $true)
{
    docker exec -it codelistdataservice /bin/bash "../https/register.sh"
    docker commit codelistdataservice
}

if ((docker container ls -a --format "table {{.Names}}").Contains("emailsender") -eq $true)
{
    docker exec -it emailsender /bin/bash "../https/register.sh"
    docker commit emailsender
}

if ((docker container ls -a --format "table {{.Names}}").Contains("identityserver") -eq $true)
{
    docker exec -it identityserver /bin/bash "../https/register.sh"
    docker commit identityserver
}

if ((docker container ls -a --format "table {{.Names}}").Contains("operationaldataservice") -eq $true)
{
    docker exec -it operationaldataservice /bin/bash "../https/register.sh"
    docker commit operationaldataservice
}

if ((docker container ls -a --format "table {{.Names}}").Contains("saledataservice") -eq $true)
{
    docker exec -it saledataservice /bin/bash "../https/register.sh"
    docker commit saledataservice
}

if ((docker container ls -a --format "table {{.Names}}").Contains("uiservice") -eq $true)
{
    docker exec -it uiservice /bin/bash "../https/register.sh"
    docker commit uiservice
}

if ((docker container ls -a --format "table {{.Names}}").Contains("actioncenterdataservice") -eq $true)
{
    docker exec -it actioncenterdataservice /bin/bash "../https/register.sh"
    docker commit actioncenterdataservice
}

if ((docker container ls -a --format "table {{.Names}}").Contains("cdreplqueuesenderservice") -eq $true)
{
    docker exec -it cdreplqueuesenderservice /bin/bash "../https/register.sh"
    docker commit cdreplqueuesenderservice
}