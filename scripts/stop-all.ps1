# ============================================
# Script: Parar Todos os Serviços
# Para a aplicação e o Keycloak
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Parar Serviços - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Parar container Keycloak
Write-Host "[1/3] Parando Keycloak..." -ForegroundColor Yellow
$keycloakRunning = docker ps --filter "name=keycloak" --format "{{.Names}}"
if ($keycloakRunning) {
    docker stop keycloak | Out-Null
    Write-Host "  ✓ Keycloak parado" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Keycloak não está rodando" -ForegroundColor Yellow
}

# Parar container PostgreSQL
Write-Host ""
Write-Host "[2/3] Parando PostgreSQL..." -ForegroundColor Yellow
$postgresRunning = docker ps --filter "name=aso-postgres" --format "{{.Names}}"
if ($postgresRunning) {
    docker stop aso-postgres | Out-Null
    Write-Host "  ✓ PostgreSQL parado" -ForegroundColor Green
} else {
    Write-Host "  ⚠ PostgreSQL não está rodando" -ForegroundColor Yellow
}

# Informar sobre a aplicação Angular
Write-Host ""
Write-Host "[3/3] Aplicação Angular..." -ForegroundColor Yellow
Write-Host "  Se a aplicação estiver rodando, pressione Ctrl+C no terminal" -ForegroundColor White

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ SERVIÇOS PARADOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar novamente:" -ForegroundColor Cyan
Write-Host "  docker start aso-postgres" -ForegroundColor White
Write-Host "  docker start keycloak" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
