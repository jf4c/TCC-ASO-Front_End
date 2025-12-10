# ============================================
# Script 3: Deploy do Tema Personalizado
# Copia e aplica o tema ASO no Keycloak
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Tema ASO - Keycloak" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$THEME_NAME = "aso-theme"
$THEME_SOURCE = "keycloak-theme-aso"
$KEYCLOAK_CONTAINER = "keycloak"
$KEYCLOAK_URL = "http://localhost:8080"
$REALM_NAME = "artificial-story-oracle"

# Determinar caminho correto baseado na localização atual
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$themePath = Join-Path $projectRoot $THEME_SOURCE

# Verificar se a pasta do tema existe
Write-Host "[1/6] Verificando arquivos do tema..." -ForegroundColor Yellow
if (-not (Test-Path $themePath)) {
    Write-Host "  ✗ Pasta '$THEME_SOURCE' não encontrada em: $themePath" -ForegroundColor Red
    Write-Host "  Certifique-se de estar na raiz do projeto" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ Pasta do tema encontrada" -ForegroundColor Green

# Verificar Docker
Write-Host ""
Write-Host "[2/6] Verificando container Keycloak..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "  ✓ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Docker não está rodando" -ForegroundColor Red
    exit 1
}

$containerRunning = docker ps --filter "name=$KEYCLOAK_CONTAINER" --format "{{.Names}}"
if (-not $containerRunning) {
    Write-Host "  ✗ Container Keycloak não está rodando" -ForegroundColor Red
    Write-Host "  Execute primeiro: 1-setup-keycloak.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ Container Keycloak está rodando" -ForegroundColor Green

# Copiar tema para o container
Write-Host ""
Write-Host "[3/6] Copiando tema para o container..." -ForegroundColor Yellow
try {
    docker exec $KEYCLOAK_CONTAINER rm -rf "/opt/keycloak/themes/$THEME_NAME" 2>$null
    docker cp "$themePath" "${KEYCLOAK_CONTAINER}:/opt/keycloak/themes/$THEME_NAME"
    Write-Host "  ✓ Tema copiado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao copiar tema: $_" -ForegroundColor Red
    exit 1
}

# Verificar se Keycloak está respondendo
Write-Host ""
Write-Host "[4/6] Verificando conectividade..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$ready = $false

while (-not $ready -and $attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "$KEYCLOAK_URL/realms/master" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
            Write-Host "  ✓ Keycloak está pronto" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Start-Sleep -Seconds 2
    }
}

if (-not $ready) {
    Write-Host "  ✗ Timeout aguardando Keycloak" -ForegroundColor Red
    exit 1
}

# Configurar realm para usar o tema
Write-Host ""
Write-Host "[5/6] Aplicando tema ao realm..." -ForegroundColor Yellow
try {
    $tokenBody = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
    $token = $tokenResponse.access_token
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Verificar se realm existe
    $realm = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" -Method GET -Headers $headers -ErrorAction SilentlyContinue
    
    if (-not $realm) {
        Write-Host "  ✗ Realm '$REALM_NAME' não existe" -ForegroundColor Red
        Write-Host "  Execute primeiro: 2-configure-realm.ps1" -ForegroundColor Yellow
        exit 1
    }
    
    # Aplicar tema
    $themeJson = @{
        "loginTheme" = $THEME_NAME
        "accountTheme" = $THEME_NAME
        "emailTheme" = $THEME_NAME
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" -Method PUT -Headers $headers -Body $themeJson
    Write-Host "  ✓ Tema aplicado ao realm" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao aplicar tema: $_" -ForegroundColor Red
    Write-Host "  Você pode aplicar manualmente no Admin Console" -ForegroundColor Yellow
}

# Reiniciar Keycloak
Write-Host ""
Write-Host "[6/6] Reiniciando Keycloak..." -ForegroundColor Yellow
Write-Host "  Isso pode levar até 30 segundos..." -ForegroundColor Yellow
docker restart $KEYCLOAK_CONTAINER | Out-Null
Start-Sleep -Seconds 5

# Aguardar Keycloak voltar
$attempt = 0
$ready = $false
while (-not $ready -and $attempt -lt 30) {
    try {
        $response = Invoke-WebRequest -Uri "$KEYCLOAK_URL/realms/master" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        $attempt++
        Start-Sleep -Seconds 2
    }
}

if ($ready) {
    Write-Host "  ✓ Keycloak reiniciado com sucesso" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Keycloak está demorando para reiniciar" -ForegroundColor Yellow
    Write-Host "  Aguarde mais alguns segundos..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ TEMA INSTALADO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para testar o tema:" -ForegroundColor Cyan
Write-Host "  1. Limpe o cache do navegador (Ctrl+Shift+Del)" -ForegroundColor White
Write-Host "  2. Acesse: http://localhost:8080/realms/artificial-story-oracle/account" -ForegroundColor White
Write-Host "  3. Ou inicie a aplicação Angular (4-install-dependencies.ps1)" -ForegroundColor White
Write-Host ""
Write-Host "Próximo passo: Execute o script 4-install-dependencies.ps1" -ForegroundColor Yellow
Write-Host ""
