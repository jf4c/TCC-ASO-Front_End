# ============================================
# Script: Verificação de Integridade do Sistema
# Testa todos os componentes e conexões
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verificação de Integridade - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# 1. Verificar Docker
Write-Host "🐳 Docker..." -ForegroundColor Yellow
try {
    $dockerRunning = docker ps 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Docker rodando" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Docker não está rodando" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Erro ao verificar Docker" -ForegroundColor Red
    $allOk = $false
}

# 2. Verificar PostgreSQL
Write-Host "🐘 PostgreSQL..." -ForegroundColor Yellow
try {
    $pgContainer = docker ps --filter "name=aso-postgres" --format "{{.Status}}" 2>$null
    if ($pgContainer -and $pgContainer -like "*Up*") {
        Write-Host "  ✓ PostgreSQL rodando" -ForegroundColor Green
        
        # Testar conexão
        $testConnection = docker exec aso-postgres pg_isready -U aso_user 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Conexão OK" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ PostgreSQL iniciando..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ PostgreSQL não está rodando" -ForegroundColor Red
        Write-Host "    Execute: .\scripts\1-setup-postgres.ps1" -ForegroundColor Gray
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Erro ao verificar PostgreSQL" -ForegroundColor Red
    $allOk = $false
}

# 3. Verificar Keycloak
Write-Host "🔐 Keycloak..." -ForegroundColor Yellow
try {
    $kcContainer = docker ps --filter "name=aso-keycloak" --format "{{.Status}}" 2>$null
    if ($kcContainer -and $kcContainer -like "*Up*") {
        Write-Host "  ✓ Keycloak rodando" -ForegroundColor Green
        
        # Testar acesso HTTP
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 5 -ErrorAction SilentlyContinue 2>$null
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✓ API acessível" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ⚠ Keycloak iniciando..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ Keycloak não está rodando" -ForegroundColor Red
        Write-Host "    Execute: .\scripts\2-setup-keycloak.ps1" -ForegroundColor Gray
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Erro ao verificar Keycloak" -ForegroundColor Red
    $allOk = $false
}

# 4. Verificar Backend
Write-Host "⚙️  Backend (.NET)..." -ForegroundColor Yellow
$backendPath = "..\TCC-ASO-Back_End"
if (Test-Path $backendPath) {
    Write-Host "  ✓ Projeto backend encontrado" -ForegroundColor Green
    
    # Verificar se está compilado
    Push-Location $backendPath
    try {
        $buildCheck = Test-Path "bin\Debug\net8.0" -ErrorAction SilentlyContinue
        if ($buildCheck) {
            Write-Host "  ✓ Projeto compilado" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Projeto não compilado" -ForegroundColor Yellow
            Write-Host "    Execute: dotnet build" -ForegroundColor Gray
        }
        
        # Verificar appsettings
        if (Test-Path "appsettings.Development.json") {
            Write-Host "  ✓ Configuração encontrada" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ appsettings.Development.json não encontrado" -ForegroundColor Yellow
        }
    } finally {
        Pop-Location
    }
    
    # Tentar testar se API está rodando
    try {
        $apiResponse = Invoke-WebRequest -Uri "https://localhost:7000/health" -SkipCertificateCheck -TimeoutSec 2 -ErrorAction SilentlyContinue 2>$null
        if ($apiResponse.StatusCode -eq 200) {
            Write-Host "  ✓ API rodando (https://localhost:7000)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ API não está rodando" -ForegroundColor Yellow
            Write-Host "    Execute: dotnet run (na pasta do backend)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ⚠ API não está rodando" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Projeto backend não encontrado em: $backendPath" -ForegroundColor Red
    Write-Host "    Clone o repositório do backend" -ForegroundColor Gray
    $allOk = $false
}

# 5. Verificar Frontend
Write-Host "🎨 Frontend (Angular)..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "  ✓ Projeto Angular encontrado" -ForegroundColor Green
    
    # Verificar node_modules
    if (Test-Path "node_modules") {
        Write-Host "  ✓ Dependências instaladas" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Dependências não instaladas" -ForegroundColor Yellow
        Write-Host "    Execute: npm install" -ForegroundColor Gray
    }
    
    # Verificar environments
    if (Test-Path "src\environments\environment.ts") {
        Write-Host "  ✓ Configuração de ambiente encontrada" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Environment file não encontrado" -ForegroundColor Yellow
    }
    
    # Tentar verificar se está rodando
    try {
        $ngResponse = Invoke-WebRequest -Uri "http://localhost:4200" -TimeoutSec 2 -ErrorAction SilentlyContinue 2>$null
        if ($ngResponse.StatusCode -eq 200) {
            Write-Host "  ✓ Dev server rodando (http://localhost:4200)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Dev server não está rodando" -ForegroundColor Yellow
            Write-Host "    Execute: npm start" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ⚠ Dev server não está rodando" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ package.json não encontrado" -ForegroundColor Red
    $allOk = $false
}

# 6. Verificar Tema Keycloak
Write-Host "🎨 Tema Keycloak..." -ForegroundColor Yellow
try {
    $themeCheck = docker exec aso-keycloak ls /opt/keycloak/themes/aso-theme 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Tema instalado" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Tema não instalado" -ForegroundColor Yellow
        Write-Host "    Execute: .\scripts\4-deploy-theme.ps1" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ⚠ Não foi possível verificar tema" -ForegroundColor Yellow
}

# Resumo
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allOk) {
    Write-Host "  ✓ Sistema OK!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "URLs importantes:" -ForegroundColor Cyan
    Write-Host "  Frontend:  http://localhost:4200" -ForegroundColor White
    Write-Host "  Backend:   https://localhost:7000" -ForegroundColor White
    Write-Host "  Swagger:   https://localhost:7000/swagger" -ForegroundColor White
    Write-Host "  Keycloak:  http://localhost:8080/admin" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "  ⚠ Alguns problemas encontrados" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Execute o setup completo:" -ForegroundColor Cyan
    Write-Host "  .\scripts\0-setup-all.ps1" -ForegroundColor White
    Write-Host ""
}

exit 0
