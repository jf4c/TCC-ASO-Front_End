# ============================================
# Script 4: Instalar Dependências Angular
# Instala todas as dependências do projeto
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalação de Dependências - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/4] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
    
    # Verificar versão mínima (v18+)
    $version = [version]($nodeVersion.Replace('v','').Split('.')[0..2] -join '.')
    $minVersion = [version]"18.0.0"
    
    if ($version -lt $minVersion) {
        Write-Host "  ⚠ Versão do Node.js é antiga. Recomendado: v18 ou superior" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Node.js não encontrado" -ForegroundColor Red
    Write-Host "  Instale o Node.js em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
Write-Host ""
Write-Host "[2/4] Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm instalado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm não encontrado" -ForegroundColor Red
    exit 1
}

# Determinar caminho do projeto
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# Verificar se package.json existe
Write-Host ""
Write-Host "[3/4] Verificando projeto..." -ForegroundColor Yellow
$packageJsonPath = Join-Path $projectRoot "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Host "  ✗ package.json não encontrado em: $projectRoot" -ForegroundColor Red
    Write-Host "  Certifique-se de estar na raiz do projeto" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ package.json encontrado" -ForegroundColor Green

# Verificar se node_modules já existe
$nodeModulesPath = Join-Path $projectRoot "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "  ⚠ node_modules já existe" -ForegroundColor Yellow
    $response = Read-Host "  Deseja reinstalar as dependências? (s/n)"
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "  Pulando instalação..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ DEPENDÊNCIAS JÁ INSTALADAS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Próximo passo: Execute o script 5-start-app.ps1" -ForegroundColor Yellow
        Write-Host ""
        exit 0
    }
    
    Write-Host "  Removendo node_modules antigo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $nodeModulesPath -ErrorAction SilentlyContinue
    Remove-Item -Force (Join-Path $projectRoot "package-lock.json") -ErrorAction SilentlyContinue
}

# Instalar dependências
Write-Host ""
Write-Host "[4/4] Instalando dependências..." -ForegroundColor Yellow
Write-Host "  Isso pode levar alguns minutos..." -ForegroundColor Yellow

# Mudar para o diretório do projeto
Push-Location $projectRoot
Write-Host ""

try {
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ DEPENDÊNCIAS INSTALADAS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Informações do projeto:" -ForegroundColor Cyan
        
        # Contar pacotes instalados
        $packageCount = (Get-ChildItem (Join-Path $projectRoot "node_modules") -Directory).Count
        Write-Host "  Pacotes instalados: $packageCount" -ForegroundColor White
        
        # Tamanho do node_modules
        $nodeModulesSize = (Get-ChildItem (Join-Path $projectRoot "node_modules") -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "  Tamanho node_modules: $([math]::Round($nodeModulesSize, 2)) MB" -ForegroundColor White
        
        Write-Host ""
        Write-Host "Próximo passo: Execute o script 5-start-app.ps1" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "  ✗ Erro durante instalação" -ForegroundColor Red
        Write-Host "  Verifique os logs acima para mais detalhes" -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "  ✗ Erro inesperado: $_" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}
