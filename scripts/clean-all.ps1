# ============================================
# Script: Limpar e Resetar Ambiente
# Remove containers e configurações
# ============================================

Write-Host "========================================" -ForegroundColor Red
Write-Host "  LIMPAR AMBIENTE - ASO" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Este script irá:" -ForegroundColor Yellow
Write-Host "  - Remover o container Keycloak" -ForegroundColor White
Write-Host "  - Remover o container PostgreSQL" -ForegroundColor White
Write-Host "  - Remover node_modules" -ForegroundColor White
Write-Host "  - Limpar configurações" -ForegroundColor White
Write-Host ""
Write-Host "Todos os dados serão perdidos!" -ForegroundColor Red
Write-Host ""

$response = Read-Host "Tem certeza que deseja continuar? (s/n)"
if ($response -ne "s" -and $response -ne "S") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Iniciando limpeza..." -ForegroundColor Yellow
Write-Host ""

# Parar e remover Keycloak
Write-Host "[1/4] Removendo Keycloak..." -ForegroundColor Yellow
$container = docker ps -a --filter "name=keycloak" --format "{{.Names}}"
if ($container) {
    docker stop keycloak 2>$null | Out-Null
    docker rm keycloak 2>$null | Out-Null
    Write-Host "  ✓ Container Keycloak removido" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Container não encontrado" -ForegroundColor Yellow
}

# Parar e remover PostgreSQL
Write-Host ""
Write-Host "[2/4] Removendo PostgreSQL..." -ForegroundColor Yellow
$postgresContainer = docker ps -a --filter "name=aso-postgres" --format "{{.Names}}"
if ($postgresContainer) {
    docker stop aso-postgres 2>$null | Out-Null
    docker rm aso-postgres 2>$null | Out-Null
    Write-Host "  ✓ Container PostgreSQL removido" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Container não encontrado" -ForegroundColor Yellow
}

# Remover node_modules
Write-Host ""
Write-Host "[3/4] Removendo node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Write-Host "  ✓ node_modules removido" -ForegroundColor Green
} else {
    Write-Host "  ⚠ node_modules não encontrado" -ForegroundColor Yellow
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    Write-Host "  ✓ package-lock.json removido" -ForegroundColor Green
}

# Limpar caches
Write-Host ""
Write-Host "[4/4] Limpando caches..." -ForegroundColor Yellow
if (Test-Path ".angular") {
    Remove-Item -Recurse -Force ".angular" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Cache Angular removido" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ AMBIENTE LIMPO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para configurar novamente:" -ForegroundColor Cyan
Write-Host "  .\scripts\0-setup-all.ps1" -ForegroundColor White
Write-Host ""
