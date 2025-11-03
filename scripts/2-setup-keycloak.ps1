# ============================================
# Script 1: Setup do Keycloak
# Cria e configura o container Keycloak
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Keycloak - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "  ✓ Docker instalado" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Docker não encontrado. Instale o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar se Docker está rodando
try {
    docker ps | Out-Null
    Write-Host "  ✓ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Docker não está rodando. Inicie o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar se já existe container
Write-Host ""
Write-Host "[2/5] Verificando containers existentes..." -ForegroundColor Yellow
$existingContainer = docker ps -a --filter "name=keycloak" --format "{{.Names}}"
if ($existingContainer) {
    Write-Host "  Container 'keycloak' já existe" -ForegroundColor Yellow
    $response = Read-Host "  Deseja remover e recriar? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host "  Removendo container antigo..." -ForegroundColor Yellow
        docker stop keycloak 2>$null
        docker rm keycloak 2>$null
        Write-Host "  ✓ Container removido" -ForegroundColor Green
    } else {
        Write-Host "  Abortando..." -ForegroundColor Red
        exit 0
    }
}

# Criar container Keycloak
Write-Host ""
Write-Host "[3/5] Criando container Keycloak..." -ForegroundColor Yellow
try {
    $containerId = docker run -d `
        --name keycloak `
        -p 8080:8080 `
        -e KEYCLOAK_ADMIN=admin `
        -e KEYCLOAK_ADMIN_PASSWORD=admin `
        quay.io/keycloak/keycloak:latest `
        start-dev
    
    Write-Host "  ✓ Container criado: $($containerId.Substring(0,12))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao criar container: $_" -ForegroundColor Red
    exit 1
}

# Aguardar inicialização
Write-Host ""
Write-Host "[4/5] Aguardando Keycloak inicializar..." -ForegroundColor Yellow
Write-Host "  Isso pode levar até 60 segundos..." -ForegroundColor Yellow

$maxAttempts = 60
$attempt = 0
$ready = $false

while (-not $ready -and $attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/realms/master" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
            Write-Host "  ✓ Keycloak está pronto!" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Write-Host "  Tentativa $attempt/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $ready) {
    Write-Host "  ✗ Timeout aguardando Keycloak. Verifique os logs: docker logs keycloak" -ForegroundColor Red
    exit 1
}

# Verificação final
Write-Host ""
Write-Host "[5/5] Verificação final..." -ForegroundColor Yellow
$running = docker ps --filter "name=keycloak" --filter "status=running" --format "{{.Names}}"
if ($running) {
    Write-Host "  ✓ Keycloak está rodando corretamente" -ForegroundColor Green
} else {
    Write-Host "  ✗ Keycloak não está rodando" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ KEYCLOAK CONFIGURADO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Admin Console: http://localhost:8080/admin" -ForegroundColor Cyan
Write-Host "Login: admin / admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximo passo: Execute o script 2-configure-realm.ps1" -ForegroundColor Yellow
Write-Host ""
