Write-Host "Configurando Keycloak..." -ForegroundColor Cyan

$KEYCLOAK_URL = "http://localhost:8080"
$REALM_NAME = "artificial-story-oracle"

Write-Host "Aguardando Keycloak iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host "Obtendo token..." -ForegroundColor Yellow
$tokenBody = "username=admin&password=admin&grant_type=password&client_id=admin-cli"
$tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
$token = $tokenResponse.access_token

$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "Criando realm..." -ForegroundColor Yellow
$realmJson = '{"realm":"artificial-story-oracle","enabled":true,"displayName":"Artificial Story Oracle","loginWithEmailAllowed":true,"registrationAllowed":true,"resetPasswordAllowed":true,"rememberMe":true,"internationalizationEnabled":true,"supportedLocales":["pt-BR","en"],"defaultLocale":"pt-BR"}'
try { Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms" -Method POST -Headers $headers -Body $realmJson } catch { Write-Host "Realm ja existe" -ForegroundColor Yellow }

Write-Host "Criando client..." -ForegroundColor Yellow
$clientJson = '{"clientId":"aso-frontend","enabled":true,"publicClient":true,"protocol":"openid-connect","standardFlowEnabled":true,"directAccessGrantsEnabled":false,"rootUrl":"http://localhost:4200","baseUrl":"http://localhost:4200","redirectUris":["http://localhost:4200/*"],"webOrigins":["http://localhost:4200","+"],"attributes":{"pkce.code.challenge.method":"S256"}}'
try { Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" -Method POST -Headers $headers -Body $clientJson } catch { Write-Host "Client ja existe" -ForegroundColor Yellow }

Write-Host "Criando roles..." -ForegroundColor Yellow
try { Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" -Method POST -Headers $headers -Body '{"name":"admin"}' } catch {}
try { Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" -Method POST -Headers $headers -Body '{"name":"player"}' } catch {}
try { Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" -Method POST -Headers $headers -Body '{"name":"game-master"}' } catch {}

Write-Host "Criando usuario admin-aso..." -ForegroundColor Yellow
$userJson = '{"username":"admin-aso","email":"admin@aso.com","firstName":"Admin","lastName":"ASO","enabled":true,"emailVerified":true,"credentials":[{"type":"password","value":"Admin@123","temporary":false}]}'
try {
    $userResponse = Invoke-WebRequest -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" -Method POST -Headers $headers -Body $userJson
    $userId = $userResponse.Headers.Location.Split('/')[-1]
} catch {
    $users = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=admin-aso" -Method GET -Headers $headers
    $userId = $users[0].id
}

Write-Host "Atribuindo roles..." -ForegroundColor Yellow
$allRoles = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" -Method GET -Headers $headers
$rolesToAssign = $allRoles | Where-Object { $_.name -in @("admin","player","game-master") }
$rolesJson = $rolesToAssign | ConvertTo-Json -AsArray
try { Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$userId/role-mappings/realm" -Method POST -Headers $headers -Body $rolesJson } catch {}

Write-Host "Aplicando tema..." -ForegroundColor Yellow
$themeJson = '{"loginTheme":"aso-theme"}'
try { Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" -Method PUT -Headers $headers -Body $themeJson } catch {}

Write-Host ""
Write-Host "CONCLUIDO!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:4200" -ForegroundColor White
Write-Host "Usuario: admin-aso" -ForegroundColor White
Write-Host "Senha: Admin@123" -ForegroundColor White
