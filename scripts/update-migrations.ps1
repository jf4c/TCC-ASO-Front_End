# ============================================
# Script: Atualizar Migrations do Banco de Dados
# Aplica todas as migrations pendentes
# ============================================

param(
    [string]$BackendPath = "..\TCC-ASO-Back_End",
    [switch]$Reset = $false,
    [switch]$Fresh = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Atualizar Migrations do Banco" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o backend existe
if (-not (Test-Path $BackendPath)) {
    Write-Host "✗ Backend não encontrado em: $BackendPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Especifique o caminho correto:" -ForegroundColor Yellow
    Write-Host "  .\update-migrations.ps1 -BackendPath 'C:\caminho\do\backend'" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Push-Location $BackendPath

try {
    # Verificar PostgreSQL
    Write-Host "🔌 Verificando PostgreSQL..." -ForegroundColor Yellow
    $pgContainer = docker ps --filter "name=aso-postgres" --format "{{.Status}}" 2>$null
    if (-not $pgContainer -or $pgContainer -notlike "*Up*") {
        Write-Host "✗ PostgreSQL não está rodando" -ForegroundColor Red
        Write-Host "Inicie com: .\scripts\1-setup-postgres.ps1" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✓ PostgreSQL está rodando" -ForegroundColor Green
    Write-Host ""

    # Opção: Reset completo
    if ($Reset -or $Fresh) {
        Write-Host "⚠️  ATENÇÃO: Isso irá DELETAR TODOS OS DADOS!" -ForegroundColor Red
        Write-Host ""
        $confirm = Read-Host "Tem certeza? Digite 'SIM' para confirmar"
        
        if ($confirm -ne "SIM") {
            Write-Host "Operação cancelada" -ForegroundColor Yellow
            exit 0
        }
        
        Write-Host ""
        Write-Host "🗑️  Removendo banco de dados..." -ForegroundColor Yellow
        dotnet ef database drop --force
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ Erro ao remover banco" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Banco removido" -ForegroundColor Green
        Write-Host ""
    }

    # Opção: Fresh migrations (remove e recria migrations)
    if ($Fresh) {
        Write-Host "🗑️  Removendo migrations antigas..." -ForegroundColor Yellow
        
        if (Test-Path "Migrations") {
            Remove-Item -Path "Migrations" -Recurse -Force
            Write-Host "✓ Migrations removidas" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "📝 Criando nova migration inicial..." -ForegroundColor Yellow
        dotnet ef migrations add InitialCreate
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ Erro ao criar migration" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Migration criada" -ForegroundColor Green
        Write-Host ""
    }

    # Listar migrations pendentes
    Write-Host "📋 Verificando migrations pendentes..." -ForegroundColor Yellow
    Write-Host ""
    
    $migrationsList = dotnet ef migrations list 2>&1
    Write-Host $migrationsList -ForegroundColor Gray
    Write-Host ""

    # Aplicar migrations
    Write-Host "🗄️  Aplicando migrations..." -ForegroundColor Yellow
    dotnet ef database update
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "✗ Erro ao aplicar migrations" -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:" -ForegroundColor Yellow
        Write-Host "  1. Verifique a connection string em appsettings.Development.json" -ForegroundColor White
        Write-Host "  2. Certifique-se que o PostgreSQL está acessível" -ForegroundColor White
        Write-Host "  3. Tente: docker exec -it aso-postgres psql -U aso_user -d aso_db" -ForegroundColor White
        Write-Host ""
        Write-Host "Para reset completo:" -ForegroundColor Yellow
        Write-Host "  .\scripts\update-migrations.ps1 -Reset" -ForegroundColor Gray
        Write-Host ""
        exit 1
    }
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✓ Migrations aplicadas com sucesso!  ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""

    # Verificar tabelas criadas
    Write-Host "📊 Verificando tabelas criadas..." -ForegroundColor Yellow
    $tables = docker exec aso-postgres psql -U aso_user -d aso_db -t -c "\dt" 2>$null
    
    if ($tables) {
        Write-Host ""
        Write-Host "Tabelas encontradas:" -ForegroundColor Gray
        Write-Host $tables -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Inicie o backend: dotnet run" -ForegroundColor White
    Write-Host "  2. Acesse o Swagger: https://localhost:7000/swagger" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "✗ Erro: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
} finally {
    Pop-Location
}

exit 0
