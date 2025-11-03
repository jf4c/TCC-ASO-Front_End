# ============================================
# Script 5: Iniciar Aplicação Angular
# Inicia o servidor de desenvolvimento
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciar Aplicação - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar dependências
Write-Host "[1/3] Verificando dependências..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  ✗ node_modules não encontrado" -ForegroundColor Red
    Write-Host "  Execute primeiro: 4-install-dependencies.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ Dependências instaladas" -ForegroundColor Green

# Verificar Keycloak
Write-Host ""
Write-Host "[2/3] Verificando Keycloak..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/realms/artificial-story-oracle" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
    Write-Host "  ✓ Keycloak está rodando" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Keycloak não está respondendo" -ForegroundColor Yellow
    Write-Host "  A aplicação pode não funcionar corretamente" -ForegroundColor Yellow
    Write-Host "  Execute: 1-setup-keycloak.ps1" -ForegroundColor Yellow
}

# Iniciar aplicação
Write-Host ""
Write-Host "[3/3] Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servidor iniciando..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "A aplicação estará disponível em:" -ForegroundColor Cyan
Write-Host "  http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "Credenciais de teste:" -ForegroundColor Cyan
Write-Host "  Usuário: admin-aso" -ForegroundColor White
Write-Host "  Senha: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
npm start
