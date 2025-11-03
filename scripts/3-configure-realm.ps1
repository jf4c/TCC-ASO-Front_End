# ============================================
# Script 2: Configurar Realm
# Cria realm, client, roles e usuários
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração do Realm - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$KEYCLOAK_URL = "http://localhost:8080"
$REALM_NAME = "artificial-story-oracle"

# Verificar se Keycloak está rodando
Write-Host "[1/6] Verificando Keycloak..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$KEYCLOAK_URL/realms/master" -UseBasicParsing -TimeoutSec 5
    Write-Host "  ✓ Keycloak está respondendo" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Keycloak não está respondendo. Execute primeiro: 1-setup-keycloak.ps1" -ForegroundColor Red
    exit 1
}

# Obter token de acesso
Write-Host ""
Write-Host "[2/6] Obtendo token de acesso..." -ForegroundColor Yellow
try {
    $tokenBody = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
    $token = $tokenResponse.access_token
    Write-Host "  ✓ Token obtido" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao obter token. Verifique credenciais (admin/admin)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Criar realm
Write-Host ""
Write-Host "[3/6] Criando realm '$REALM_NAME'..." -ForegroundColor Yellow
$realmJson = @{
    realm = $REALM_NAME
    enabled = $true
    displayName = "Artificial Story Oracle"
    loginWithEmailAllowed = $true
    registrationAllowed = $true
    resetPasswordAllowed = $true
    rememberMe = $true
    internationalizationEnabled = $true
    supportedLocales = @("pt-BR")
    defaultLocale = "pt-BR"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms" -Method POST -Headers $headers -Body $realmJson
    Write-Host "  ✓ Realm criado" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "  ⚠ Realm já existe" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ Erro ao criar realm: $_" -ForegroundColor Red
        exit 1
    }
}

# Criar client
Write-Host ""
Write-Host "[4/6] Criando client 'aso-frontend'..." -ForegroundColor Yellow
$clientJson = @{
    clientId = "aso-frontend"
    enabled = $true
    publicClient = $true
    protocol = "openid-connect"
    standardFlowEnabled = $true
    directAccessGrantsEnabled = $false
    rootUrl = "http://localhost:4200"
    baseUrl = "http://localhost:4200"
    redirectUris = @("http://localhost:4200/*")
    webOrigins = @("http://localhost:4200", "+")
    attributes = @{
        "pkce.code.challenge.method" = "S256"
    }
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" -Method POST -Headers $headers -Body $clientJson
    Write-Host "  ✓ Client criado" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "  ⚠ Client já existe" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ Erro ao criar client: $_" -ForegroundColor Red
    }
}

# Criar roles
Write-Host ""
Write-Host "[5/6] Criando roles..." -ForegroundColor Yellow
$roles = @("admin", "player", "game-master")
foreach ($role in $roles) {
    $roleJson = @{
        name = $role
        description = "Role $role"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" -Method POST -Headers $headers -Body $roleJson
        Write-Host "  ✓ Role '$role' criada" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  ⚠ Role '$role' já existe" -ForegroundColor Yellow
        }
    }
}

# Criar usuário admin
Write-Host ""
Write-Host "[6/6] Criando usuário admin-aso..." -ForegroundColor Yellow
$userJson = @{
    username = "admin-aso"
    email = "admin@aso.com"
    firstName = "Admin"
    lastName = "ASO"
    enabled = $true
    emailVerified = $true
    credentials = @(
        @{
            type = "password"
            value = "Admin@123"
            temporary = $false
        }
    )
} | ConvertTo-Json

try {
    $userResponse = Invoke-WebRequest -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" -Method POST -Headers $headers -Body $userJson
    $userId = $userResponse.Headers.Location.Split('/')[-1]
    Write-Host "  ✓ Usuário criado: $userId" -ForegroundColor Green
    
    # Atribuir roles
    $allRoles = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" -Method GET -Headers $headers
    $rolesToAssign = $allRoles | Where-Object { $_.name -in @("admin","player","game-master") }
    $rolesJson = $rolesToAssign | ConvertTo-Json -AsArray
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$userId/role-mappings/realm" -Method POST -Headers $headers -Body $rolesJson
    Write-Host "  ✓ Roles atribuídas ao usuário" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "  ⚠ Usuário já existe" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ Erro ao criar usuário: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ REALM CONFIGURADO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Realm: $REALM_NAME" -ForegroundColor Cyan
Write-Host "Client: aso-frontend" -ForegroundColor Cyan
Write-Host "Usuário: admin-aso" -ForegroundColor Cyan
Write-Host "Senha: Admin@123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximo passo: Execute o script 3-deploy-theme.ps1" -ForegroundColor Yellow
Write-Host ""
