# Dockerfile para Backend API - Yeti Library System
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos de projeto
COPY ["Projeto2020_API/Projeto2020_API.csproj", "Projeto2020_API/"]
COPY ["Dominio/Dominio.csproj", "Dominio/"]
COPY ["Interface/Interface.csproj", "Interface/"]
COPY ["InfraEstrutura/InfraEstrutura.csproj", "InfraEstrutura/"]
COPY ["Service/Service.csproj", "Service/"]

# Restaurar dependências
RUN dotnet restore "Projeto2020_API/Projeto2020_API.csproj"

# Copiar todo o código
COPY . .

# Build da aplicação
WORKDIR "/src/Projeto2020_API"
RUN dotnet build "Projeto2020_API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Projeto2020_API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Configurações de produção
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "Projeto2020_API.dll"]


