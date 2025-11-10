# ============================================
# Script: Setup do Backend
# Configura o backend ASO (API + Banco de Dados)
# ============================================

param(
    [string]$BackendPath = "..\TCC-ASO-Back_End"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup do Backend ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o caminho do backend existe
if (-not (Test-Path $BackendPath)) {
    Write-Host "✗ Pasta do backend não encontrada: $BackendPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Yellow
    Write-Host "  1. Clone o repositório do backend" -ForegroundColor White
    Write-Host "  2. Especifique o caminho correto:" -ForegroundColor White
    Write-Host "     .\1.5-setup-backend.ps1 -BackendPath 'C:\caminho\do\backend'" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "Backend encontrado em: $BackendPath" -ForegroundColor Green
Write-Host ""

# Navegar para a pasta do backend
Push-Location $BackendPath

try {
    # 1. Restaurar pacotes NuGet
    Write-Host "📦 Restaurando pacotes NuGet..." -ForegroundColor Yellow
    dotnet restore
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Erro ao restaurar pacotes" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Pacotes restaurados com sucesso" -ForegroundColor Green
    Write-Host ""

    # 2. Verificar conexão com PostgreSQL
    Write-Host "🔌 Verificando conexão com PostgreSQL..." -ForegroundColor Yellow
    
    # Tentar conectar via docker
    $pgRunning = docker ps --filter "name=aso-postgres" --format "{{.Status}}" 2>$null
    if (-not $pgRunning -or $pgRunning -notlike "*Up*") {
        Write-Host "⚠ PostgreSQL não está rodando" -ForegroundColor Yellow
        Write-Host "Iniciando PostgreSQL..." -ForegroundColor Yellow
        
        # Tentar iniciar via script existente
        if (Test-Path "..\artificial-story-oracle\scripts\1-setup-postgres.ps1") {
            & "..\artificial-story-oracle\scripts\1-setup-postgres.ps1"
        } else {
            Write-Host "✗ Script de setup do PostgreSQL não encontrado" -ForegroundColor Red
            Write-Host "Execute manualmente: docker-compose up -d postgres" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "✓ PostgreSQL está rodando" -ForegroundColor Green
    }
    Write-Host ""

    # 3. Aplicar Migrations
    Write-Host "🗄️  Aplicando migrations do banco de dados..." -ForegroundColor Yellow
    Write-Host ""
    
    # Verificar se há migrations pendentes
    $pendingMigrations = dotnet ef migrations list --no-build 2>$null
    
    # Aplicar migrations
    dotnet ef database update
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "✗ Erro ao aplicar migrations" -ForegroundColor Red
        Write-Host ""
        Write-Host "Possíveis soluções:" -ForegroundColor Yellow
        Write-Host "  1. Verifique se o PostgreSQL está rodando" -ForegroundColor White
        Write-Host "  2. Verifique a connection string no appsettings.json" -ForegroundColor White
        Write-Host "  3. Execute manualmente: dotnet ef database update" -ForegroundColor White
        Write-Host ""
        exit 1
    }
    
    Write-Host ""
    Write-Host "✓ Migrations aplicadas com sucesso" -ForegroundColor Green
    Write-Host ""

    # 4. Compilar projeto
    Write-Host "🔨 Compilando projeto..." -ForegroundColor Yellow
    dotnet build --configuration Debug --no-restore
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Erro ao compilar projeto" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Projeto compilado com sucesso" -ForegroundColor Green
    Write-Host ""

    # 5. Verificar appsettings
    Write-Host "⚙️  Verificando configurações..." -ForegroundColor Yellow
    
    $appsettingsPath = "appsettings.Development.json"
    if (Test-Path $appsettingsPath) {
        Write-Host "✓ appsettings.Development.json encontrado" -ForegroundColor Green
        
        # Ler e exibir informações importantes
        $appsettings = Get-Content $appsettingsPath | ConvertFrom-Json
        
        if ($appsettings.ConnectionStrings) {
            Write-Host "  Database: Configurado" -ForegroundColor Gray
        }
        
        if ($appsettings.Keycloak) {
            Write-Host "  Keycloak: Configurado" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠ appsettings.Development.json não encontrado" -ForegroundColor Yellow
        Write-Host "  Copie de appsettings.json e ajuste as configurações" -ForegroundColor Yellow
    }
    Write-Host ""

    # Resumo
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✓ Backend configurado com sucesso!   ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar o backend:" -ForegroundColor Cyan
    Write-Host "  cd $BackendPath" -ForegroundColor White
    Write-Host "  dotnet run" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou use o Visual Studio / Rider" -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "✗ Erro durante o setup: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
} finally {
    # Voltar para o diretório original
    Pop-Location
}

exit 0
