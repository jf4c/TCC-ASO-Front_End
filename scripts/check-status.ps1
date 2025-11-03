# ============================================
# Script: Verificar Status dos Serviços
# Verifica se tudo está funcionando
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Status dos Serviços - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# Verificar Docker
Write-Host "[1/8] Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker ps | Out-Null
    Write-Host "  ✓ Docker instalado e rodando" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Docker não está disponível" -ForegroundColor Red
    $allOk = $false
}

# Verificar container PostgreSQL
Write-Host ""
Write-Host "[2/8] Container PostgreSQL..." -ForegroundColor Yellow
$postgresContainer = docker ps --filter "name=aso-postgres" --filter "status=running" --format "{{.Names}}"
if ($postgresContainer) {
    Write-Host "  ✓ Container rodando" -ForegroundColor Green
} else {
    Write-Host "  ✗ Container não está rodando" -ForegroundColor Red
    $allOk = $false
}

# Verificar PostgreSQL respondendo
Write-Host ""
Write-Host "[3/8] PostgreSQL Database..." -ForegroundColor Yellow
try {
    $pgTest = docker exec aso-postgres pg_isready -U aso_user 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ PostgreSQL respondendo (porta 5432)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ PostgreSQL não está respondendo" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ PostgreSQL não está respondendo" -ForegroundColor Red
    $allOk = $false
}

# Verificar container Keycloak
Write-Host ""
Write-Host "[4/8] Container Keycloak..." -ForegroundColor Yellow
# Verificar container Keycloak
Write-Host ""
Write-Host "[4/8] Container Keycloak..." -ForegroundColor Yellow
$container = docker ps --filter "name=keycloak" --filter "status=running" --format "{{.Names}}"
if ($container) {
    Write-Host "  ✓ Container rodando" -ForegroundColor Green
} else {
    Write-Host "  ✗ Container não está rodando" -ForegroundColor Red
    $allOk = $false
}

# Verificar Keycloak respondendo
Write-Host ""
Write-Host "[5/8] Keycloak API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/realms/master" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  ✓ Keycloak respondendo (porta 8080)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Keycloak não está respondendo" -ForegroundColor Red
    $allOk = $false
}

# Verificar realm
Write-Host ""
Write-Host "[6/8] Realm artificial-story-oracle..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/realms/artificial-story-oracle" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  ✓ Realm configurado" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Realm não encontrado" -ForegroundColor Red
    $allOk = $false
}

# Verificar Node.js
Write-Host ""
Write-Host "[7/8] Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js não encontrado" -ForegroundColor Red
    $allOk = $false
}

# Verificar dependências
Write-Host ""
Write-Host "[8/8] Dependências Angular..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $packageCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "  ✓ node_modules instalado ($packageCount pacotes)" -ForegroundColor Green
} else {
    Write-Host "  ✗ node_modules não encontrado" -ForegroundColor Red
    $allOk = $false
}

# Verificar tema (removido, era item 7/7)
# Write-Host ""
# Write-Host "[7/7] Tema personalizado..." -ForegroundColor Yellow
    $allOk = $false
}

# Resumo
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "  ✓ TUDO FUNCIONANDO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "A aplicação está pronta para uso:" -ForegroundColor Cyan
    Write-Host "  .\scripts\6-start-app.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou:" -ForegroundColor Cyan
    Write-Host "  npm start" -ForegroundColor White
} else {
    Write-Host "  ⚠ ALGUNS PROBLEMAS ENCONTRADOS" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Execute o setup completo:" -ForegroundColor Cyan
    Write-Host "  .\scripts\0-setup-all.ps1" -ForegroundColor White
}
Write-Host ""
