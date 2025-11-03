# ============================================
# Script 0: Setup Completo
# Executa todos os scripts em sequência
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Completo - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script irá executar todos os passos necessários:" -ForegroundColor Yellow
Write-Host "  1. Setup do PostgreSQL" -ForegroundColor White
Write-Host "  2. Setup do Keycloak" -ForegroundColor White
Write-Host "  3. Configuração do Realm" -ForegroundColor White
Write-Host "  4. Deploy do Tema" -ForegroundColor White
Write-Host "  5. Instalação de Dependências" -ForegroundColor White
Write-Host "  6. Iniciar Aplicação" -ForegroundColor White
Write-Host ""
Write-Host "Tempo estimado: 5-10 minutos" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Deseja continuar? (s/n)"
if ($response -ne "s" -and $response -ne "S") {
    Write-Host "Abortado pelo usuário." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando setup completo..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Script 1: Setup PostgreSQL
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PASSO 1/6: Setup PostgreSQL          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
& "$PSScriptRoot\1-setup-postgres.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Erro no setup do PostgreSQL" -ForegroundColor Red
    exit 1
}

Write-Host ""
Read-Host "Pressione Enter para continuar para o próximo passo..."
Write-Host ""

# Script 2: Setup Keycloak
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PASSO 2/6: Setup Keycloak            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
& "$PSScriptRoot\2-setup-keycloak.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Erro no setup do Keycloak" -ForegroundColor Red
    exit 1
}

Write-Host ""
Read-Host "Pressione Enter para continuar para o próximo passo..."
Write-Host ""

# Script 3: Configurar Realm
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PASSO 3/6: Configurar Realm          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
& "$PSScriptRoot\3-configure-realm.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Erro na configuração do realm" -ForegroundColor Red
    exit 1
}

Write-Host ""
Read-Host "Pressione Enter para continuar para o próximo passo..."
Write-Host ""

# Script 4: Deploy Tema
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PASSO 4/6: Deploy Tema               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
& "$PSScriptRoot\4-deploy-theme.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Erro no deploy do tema" -ForegroundColor Red
    exit 1
}

Write-Host ""
Read-Host "Pressione Enter para continuar para o próximo passo..."
Write-Host ""

# Script 5: Instalar Dependências
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  PASSO 5/6: Instalar Dependências     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
& "$PSScriptRoot\5-install-dependencies.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Erro na instalação de dependências" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ SETUP COMPLETO!                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar a aplicação:" -ForegroundColor Cyan
Write-Host "  .\scripts\6-start-app.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Ou execute manualmente:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""

$response = Read-Host "Deseja iniciar a aplicação agora? (s/n)"
if ($response -eq "s" -or $response -eq "S") {
    Write-Host ""
    & "$PSScriptRoot\6-start-app.ps1"
}
