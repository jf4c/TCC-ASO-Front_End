# ============================================
# Script 0: Verificar Pré-requisitos
# Verifica se todas as ferramentas necessárias estão instaladas
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verificando Pré-requisitos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Node.js não encontrado" -ForegroundColor Red
        Write-Host "    Instale em: https://nodejs.org/" -ForegroundColor Yellow
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Node.js não encontrado" -ForegroundColor Red
    Write-Host "    Instale em: https://nodejs.org/" -ForegroundColor Yellow
    $allOk = $false
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "  ✓ npm instalado: v$npmVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ npm não encontrado" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ npm não encontrado" -ForegroundColor Red
    $allOk = $false
}

# Verificar .NET SDK
Write-Host "Verificando .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version 2>$null
    if ($dotnetVersion) {
        Write-Host "  ✓ .NET SDK instalado: v$dotnetVersion" -ForegroundColor Green
        
        # Verificar se é .NET 8 ou superior
        $majorVersion = [int]($dotnetVersion.Split('.')[0])
        if ($majorVersion -lt 8) {
            Write-Host "    ⚠ Versão recomendada: .NET 8.0 ou superior" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ .NET SDK não encontrado" -ForegroundColor Red
        Write-Host "    Instale em: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ .NET SDK não encontrado" -ForegroundColor Red
    Write-Host "    Instale em: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    $allOk = $false
}

# Verificar EF Core Tools
Write-Host "Verificando EF Core Tools..." -ForegroundColor Yellow
try {
    $efVersion = dotnet ef --version 2>$null
    if ($efVersion) {
        Write-Host "  ✓ EF Core Tools instalado" -ForegroundColor Green
    } else {
        Write-Host "  ✗ EF Core Tools não encontrado" -ForegroundColor Red
        Write-Host "    Instale com: dotnet tool install --global dotnet-ef" -ForegroundColor Yellow
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ EF Core Tools não encontrado" -ForegroundColor Red
    Write-Host "    Instale com: dotnet tool install --global dotnet-ef" -ForegroundColor Yellow
    $allOk = $false
}

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "  ✓ Docker instalado: $dockerVersion" -ForegroundColor Green
        
        # Verificar se Docker está rodando
        $dockerRunning = docker ps 2>$null
        if ($dockerRunning -ne $null) {
            Write-Host "  ✓ Docker está rodando" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Docker não está rodando" -ForegroundColor Yellow
            Write-Host "    Inicie o Docker Desktop" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ Docker não encontrado" -ForegroundColor Red
        Write-Host "    Instale em: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Docker não encontrado" -ForegroundColor Red
    Write-Host "    Instale em: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    $allOk = $false
}

# Verificar Git
Write-Host "Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "  ✓ Git instalado: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Git não encontrado (opcional)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠ Git não encontrado (opcional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allOk) {
    Write-Host "  ✓ Todos os pré-requisitos OK!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Próximo passo:" -ForegroundColor Cyan
    Write-Host "  .\scripts\0-setup-all.ps1" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "  ✗ Alguns pré-requisitos não atendidos" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Instale os itens faltantes e execute novamente." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
