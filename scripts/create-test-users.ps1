# Script para criar múltiplos usuários de teste no Keycloak
# Execute este script para popular o Keycloak com usuários para testes do sistema de amigos

param(
    [int]$NumUsers = 10,
    [string]$KeycloakUrl = "http://localhost:8080",
    [string]$Realm = "artificial-story-oracle",
    [string]$AdminUser = "admin",
    [string]$AdminPassword = "admin",
    [string]$DefaultPassword = "Test@123"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Criador de Usuários de Teste" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para obter token de administrador
function Get-AdminToken {
    Write-Host "🔑 Obtendo token de administrador..." -ForegroundColor Yellow
    
    $tokenUrl = "$KeycloakUrl/realms/master/protocol/openid-connect/token"
    $body = @{
        username   = $AdminUser
        password   = $AdminPassword
        grant_type = "password"
        client_id  = "admin-cli"
    }

    try {
        $response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
        Write-Host "✅ Token obtido com sucesso" -ForegroundColor Green
        return $response.access_token
    }
    catch {
        Write-Host "❌ Erro ao obter token: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Função para criar usuário
function Create-User {
    param(
        [string]$Token,
        [string]$NickName,
        [string]$FirstName,
        [string]$LastName,
        [string]$Email
    )

    $usersUrl = "$KeycloakUrl/admin/realms/$Realm/users"
    
    $userData = @{
        username      = $NickName
        enabled       = $true
        emailVerified = $true
        firstName     = $FirstName
        lastName      = $LastName
        email         = $Email
        credentials   = @(
            @{
                type      = "password"
                value     = $DefaultPassword
                temporary = $false
            }
        )
    } | ConvertTo-Json -Depth 10

    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type"  = "application/json"
    }

    try {
        $response = Invoke-WebRequest -Uri $usersUrl -Method Post -Body $userData -Headers $headers
        
        if ($response.StatusCode -eq 201) {
            Write-Host "✅ Usuário criado: $NickName ($FirstName $LastName)" -ForegroundColor Green
            return $true
        }
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "⚠️  Usuário já existe: $NickName" -ForegroundColor Yellow
        }
        else {
            Write-Host "❌ Erro ao criar $NickName : $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

# Lista de usuários de teste
$testUsers = @(
    @{ NickName = "admin_test"; FirstName = "Admin"; LastName = "Teste"; Email = "admin.test@aso.com" },
    @{ NickName = "jogador01"; FirstName = "João"; LastName = "Silva"; Email = "joao.silva@aso.com" },
    @{ NickName = "jogador02"; FirstName = "Maria"; LastName = "Santos"; Email = "maria.santos@aso.com" },
    @{ NickName = "jogador03"; FirstName = "Pedro"; LastName = "Costa"; Email = "pedro.costa@aso.com" },
    @{ NickName = "jogador04"; FirstName = "Ana"; LastName = "Oliveira"; Email = "ana.oliveira@aso.com" },
    @{ NickName = "mestre_rpg"; FirstName = "Carlos"; LastName = "Mestre"; Email = "carlos.mestre@aso.com" },
    @{ NickName = "warrior_99"; FirstName = "Bruno"; LastName = "Guerreiro"; Email = "bruno.warrior@aso.com" },
    @{ NickName = "mage_power"; FirstName = "Lucia"; LastName = "Maga"; Email = "lucia.mage@aso.com" },
    @{ NickName = "rogue_ninja"; FirstName = "Rafael"; LastName = "Ladino"; Email = "rafael.rogue@aso.com" },
    @{ NickName = "healer_good"; FirstName = "Fernanda"; LastName = "Curandeira"; Email = "fernanda.healer@aso.com" },
    @{ NickName = "tank_strong"; FirstName = "Marcos"; LastName = "Tanque"; Email = "marcos.tank@aso.com" },
    @{ NickName = "archer_pro"; FirstName = "Julia"; LastName = "Arqueira"; Email = "julia.archer@aso.com" },
    @{ NickName = "bard_songs"; FirstName = "Gabriel"; LastName = "Bardo"; Email = "gabriel.bard@aso.com" },
    @{ NickName = "paladin_luz"; FirstName = "Amanda"; LastName = "Paladina"; Email = "amanda.paladin@aso.com" },
    @{ NickName = "necro_dark"; FirstName = "Diego"; LastName = "Necromante"; Email = "diego.necro@aso.com" },
    @{ NickName = "druid_nat"; FirstName = "Patricia"; LastName = "Druida"; Email = "patricia.druid@aso.com" },
    @{ NickName = "monk_zen"; FirstName = "Lucas"; LastName = "Monge"; Email = "lucas.monk@aso.com" },
    @{ NickName = "ranger_wild"; FirstName = "Beatriz"; LastName = "Ranger"; Email = "beatriz.ranger@aso.com" },
    @{ NickName = "wizard_old"; FirstName = "Roberto"; LastName = "Mago"; Email = "roberto.wizard@aso.com" },
    @{ NickName = "cleric_holy"; FirstName = "Carla"; LastName = "Clériga"; Email = "carla.cleric@aso.com" }
)

# Limitar ao número solicitado
$usersToCreate = $testUsers | Select-Object -First $NumUsers

Write-Host "📊 Configuração:" -ForegroundColor Cyan
Write-Host "   Keycloak URL: $KeycloakUrl" -ForegroundColor White
Write-Host "   Realm: $Realm" -ForegroundColor White
Write-Host "   Usuários a criar: $NumUsers" -ForegroundColor White
Write-Host "   Senha padrão: $DefaultPassword" -ForegroundColor White
Write-Host ""

# Obter token
$token = Get-AdminToken
Write-Host ""

# Criar usuários
Write-Host "👥 Criando usuários..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($user in $usersToCreate) {
    $result = Create-User -Token $token -NickName $user.NickName -FirstName $user.FirstName -LastName $user.LastName -Email $user.Email
    
    if ($result) {
        $successCount++
    }
    else {
        $errorCount++
    }
    
    Start-Sleep -Milliseconds 200  # Pequeno delay entre requisições
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Resumo da Execução" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Criados com sucesso: $successCount" -ForegroundColor Green
Write-Host "⚠️  Erros ou já existentes: $errorCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Credenciais de acesso:" -ForegroundColor Cyan
Write-Host "   Username: [nickname do usuário]" -ForegroundColor White
Write-Host "   Password: $DefaultPassword" -ForegroundColor White
Write-Host ""
Write-Host "🎮 Use estes usuários para testar o sistema de amigos!" -ForegroundColor Green
Write-Host ""
