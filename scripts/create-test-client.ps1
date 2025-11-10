# Script para criar client de teste no Keycloak
# Permite Direct Access Grants para testes via curl/Postman

$ErrorActionPreference = "Stop"

$KEYCLOAK_URL = "http://localhost:8080"
$REALM_NAME = "artificial-story-oracle"
$CLIENT_ID = "aso-backend-test"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Criando Client de Teste no Keycloak" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obter token de admin
Write-Host "[1/2] Obtendo token de admin..." -ForegroundColor Yellow
try {
    $tokenBody = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" -Method POST -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
    $token = $tokenResponse.access_token
    Write-Host "  ✓ Token obtido" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao obter token: $_" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Criar client de teste
Write-Host ""
Write-Host "[2/2] Criando client '$CLIENT_ID'..." -ForegroundColor Yellow
$clientJson = @{
    clientId = $CLIENT_ID
    enabled = $true
    publicClient = $true
    protocol = "openid-connect"
    standardFlowEnabled = $false
    directAccessGrantsEnabled = $true
    description = "Client para testes de API com Direct Access Grants"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" -Method POST -Headers $headers -Body $clientJson
    Write-Host "  ✓ Client criado com sucesso!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "  ⚠ Client já existe" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ Erro ao criar client: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Client de teste configurado!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Use este curl para obter token JWT:" -ForegroundColor Cyan
Write-Host ""
Write-Host "curl --location 'http://localhost:8080/realms/artificial-story-oracle/protocol/openid-connect/token' \" -ForegroundColor Yellow
Write-Host "--header 'Content-Type: application/x-www-form-urlencoded' \" -ForegroundColor Yellow
Write-Host "--data-urlencode 'client_id=$CLIENT_ID' \" -ForegroundColor Yellow
Write-Host "--data-urlencode 'username=jf4c' \" -ForegroundColor Yellow
Write-Host "--data-urlencode 'password=jfac1923' \" -ForegroundColor Yellow
Write-Host "--data-urlencode 'grant_type=password'" -ForegroundColor Yellow
Write-Host ""
