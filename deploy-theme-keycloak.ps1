# Script para Deploy do Tema Personalizado no Keycloak
# Artificial Story Oracle

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Deploy Tema ASO para Keycloak" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$THEME_NAME = "aso-theme"
$THEME_SOURCE = "keycloak-theme-aso"
$KEYCLOAK_CONTAINER = "keycloak"

# Verificar se o Docker está rodando
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "  ✓ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Docker não está rodando. Inicie o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar se o container do Keycloak existe
Write-Host ""
Write-Host "[2/5] Verificando container Keycloak..." -ForegroundColor Yellow
$containerExists = docker ps -a --filter "name=$KEYCLOAK_CONTAINER" --format "{{.Names}}"
if (-not $containerExists) {
    Write-Host "  ✗ Container '$KEYCLOAK_CONTAINER' não encontrado" -ForegroundColor Red
    Write-Host "  Execute primeiro: docker run -d --name keycloak -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev" -ForegroundColor Yellow
    exit 1
}

$containerRunning = docker ps --filter "name=$KEYCLOAK_CONTAINER" --format "{{.Names}}"
if (-not $containerRunning) {
    Write-Host "  Container existe mas não está rodando. Iniciando..." -ForegroundColor Yellow
    docker start $KEYCLOAK_CONTAINER
    Write-Host "  ✓ Container iniciado" -ForegroundColor Green
    Write-Host "  Aguardando Keycloak inicializar (30s)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
} else {
    Write-Host "  ✓ Container Keycloak está rodando" -ForegroundColor Green
}

# Copiar tema para o container
Write-Host ""
Write-Host "[3/5] Copiando tema para o container..." -ForegroundColor Yellow
try {
    # Remover tema antigo se existir
    docker exec $KEYCLOAK_CONTAINER rm -rf "/opt/keycloak/themes/$THEME_NAME" 2>$null
    
    # Copiar novo tema
    docker cp "$THEME_SOURCE" "${KEYCLOAK_CONTAINER}:/opt/keycloak/themes/$THEME_NAME"
    Write-Host "  ✓ Tema copiado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao copiar tema: $_" -ForegroundColor Red
    exit 1
}

# Configurar realm para usar o tema
Write-Host ""
Write-Host "[4/5] Configurando realm..." -ForegroundColor Yellow

$KEYCLOAK_URL = "http://localhost:8080"
$REALM_NAME = "artificial-story-oracle"

# Aguardar Keycloak estar pronto
Write-Host "  Aguardando Keycloak responder..." -ForegroundColor Yellow
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

# Obter token de acesso
Write-Host "  Obtendo token de acesso..." -ForegroundColor Yellow
try {
    $tokenBody = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
    $token = $tokenResponse.access_token
    Write-Host "  ✓ Token obtido" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao obter token: $_" -ForegroundColor Red
    Write-Host "  Verifique se admin/admin está correto" -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Verificar se o realm existe
Write-Host "  Verificando realm '$REALM_NAME'..." -ForegroundColor Yellow
try {
    $realm = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" -Method GET -Headers $headers -ErrorAction SilentlyContinue
    Write-Host "  ✓ Realm encontrado" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Realm '$REALM_NAME' não existe" -ForegroundColor Red
    Write-Host "  Execute primeiro: .\setup-keycloak.ps1" -ForegroundColor Yellow
    exit 1
}

# Aplicar tema ao realm
Write-Host "  Aplicando tema '$THEME_NAME' ao realm..." -ForegroundColor Yellow
try {
    $themeJson = @{
        "loginTheme" = $THEME_NAME
        "accountTheme" = $THEME_NAME
        "adminTheme" = $null
        "emailTheme" = $THEME_NAME
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" -Method PUT -Headers $headers -Body $themeJson
    Write-Host "  ✓ Tema aplicado ao realm" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao aplicar tema: $_" -ForegroundColor Red
    Write-Host "  Você pode aplicar manualmente no Admin Console" -ForegroundColor Yellow
}

# Limpar cache (opcional - requer restart)
Write-Host ""
Write-Host "[5/5] Reiniciando Keycloak para aplicar mudanças..." -ForegroundColor Yellow
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
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  ✓ TEMA INSTALADO COM SUCESSO!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Acesse: http://localhost:8080/admin" -ForegroundColor White
Write-Host "  2. Login: admin / admin" -ForegroundColor White
Write-Host "  3. Selecione realm: artificial-story-oracle" -ForegroundColor White
Write-Host "  4. Vá em Realm Settings > Themes" -ForegroundColor White
Write-Host "  5. Verifique se Login theme = aso-theme" -ForegroundColor White
Write-Host ""
Write-Host "Para testar o tema:" -ForegroundColor Cyan
Write-Host "  Acesse: http://localhost:8080/realms/artificial-story-oracle/account" -ForegroundColor White
Write-Host "  Ou inicie sua aplicação Angular e faça login" -ForegroundColor White
Write-Host ""
Write-Host "Se o tema não aparecer:" -ForegroundColor Yellow
Write-Host "  1. Limpe o cache do navegador (Ctrl+Shift+Del)" -ForegroundColor White
Write-Host "  2. Tente modo anônimo/privado" -ForegroundColor White
Write-Host "  3. Verifique logs: docker logs keycloak" -ForegroundColor White
Write-Host ""
