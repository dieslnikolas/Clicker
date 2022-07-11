#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Clicker.Api/Clicker.Api.csproj", "Clicker.Api/"]
RUN dotnet restore "Clicker.Api/Clicker.Api.csproj"
COPY . .
WORKDIR "/src/Clicker.Api"
RUN dotnet build "Clicker.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Clicker.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Clicker.Api.dll"]