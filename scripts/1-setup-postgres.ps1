# ============================================
# Script: Setup PostgreSQL
# Cria e configura o banco de dados
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup PostgreSQL - ASO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$DB_CONTAINER = "aso-postgres"
$DB_NAME = "aso_db"
$DB_USER = "aso_user"
$DB_PASSWORD = "aso_password"
$DB_PORT = 5432

# Verificar Docker
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker ps | Out-Null
    Write-Host "  ✓ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Docker não está rodando. Inicie o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar se já existe container
Write-Host ""
Write-Host "[2/5] Verificando containers existentes..." -ForegroundColor Yellow
$existingContainer = docker ps -a --filter "name=$DB_CONTAINER" --format "{{.Names}}"
if ($existingContainer) {
    Write-Host "  Container '$DB_CONTAINER' já existe" -ForegroundColor Yellow
    $response = Read-Host "  Deseja remover e recriar? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host "  Removendo container antigo..." -ForegroundColor Yellow
        docker stop $DB_CONTAINER 2>$null
        docker rm $DB_CONTAINER 2>$null
        Write-Host "  ✓ Container removido" -ForegroundColor Green
    } else {
        # Verificar se está rodando
        $running = docker ps --filter "name=$DB_CONTAINER" --format "{{.Names}}"
        if (-not $running) {
            Write-Host "  Iniciando container existente..." -ForegroundColor Yellow
            docker start $DB_CONTAINER | Out-Null
        }
        Write-Host "  ✓ Usando container existente" -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ POSTGRESQL JÁ CONFIGURADO!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Conexão:" -ForegroundColor Cyan
        Write-Host "  Host: localhost" -ForegroundColor White
        Write-Host "  Porta: $DB_PORT" -ForegroundColor White
        Write-Host "  Database: $DB_NAME" -ForegroundColor White
        Write-Host "  Usuário: $DB_USER" -ForegroundColor White
        Write-Host "  Senha: $DB_PASSWORD" -ForegroundColor White
        Write-Host ""
        exit 0
    }
}

# Criar container PostgreSQL
Write-Host ""
Write-Host "[3/5] Criando container PostgreSQL..." -ForegroundColor Yellow
try {
    $containerId = docker run -d `
        --name $DB_CONTAINER `
        -e POSTGRES_DB=$DB_NAME `
        -e POSTGRES_USER=$DB_USER `
        -e POSTGRES_PASSWORD=$DB_PASSWORD `
        -p ${DB_PORT}:5432 `
        -v aso-postgres-data:/var/lib/postgresql/data `
        postgres:15-alpine
    
    Write-Host "  ✓ Container criado: $($containerId.Substring(0,12))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Erro ao criar container: $_" -ForegroundColor Red
    exit 1
}

# Aguardar inicialização
Write-Host ""
Write-Host "[4/5] Aguardando PostgreSQL inicializar..." -ForegroundColor Yellow
Write-Host "  Isso pode levar até 30 segundos..." -ForegroundColor Yellow

$maxAttempts = 30
$attempt = 0
$ready = $false

while (-not $ready -and $attempt -lt $maxAttempts) {
    try {
        $result = docker exec $DB_CONTAINER pg_isready -U $DB_USER 2>$null
        if ($LASTEXITCODE -eq 0) {
            $ready = $true
            Write-Host "  ✓ PostgreSQL está pronto!" -ForegroundColor Green
        }
    } catch {
        $attempt++
        Write-Host "  Tentativa $attempt/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 1
    }
}

if (-not $ready) {
    Write-Host "  ✗ Timeout aguardando PostgreSQL. Verifique os logs: docker logs $DB_CONTAINER" -ForegroundColor Red
    exit 1
}

# Verificação final
Write-Host ""
Write-Host "[5/5] Verificação final..." -ForegroundColor Yellow
$running = docker ps --filter "name=$DB_CONTAINER" --filter "status=running" --format "{{.Names}}"
if ($running) {
    Write-Host "  ✓ PostgreSQL está rodando corretamente" -ForegroundColor Green
} else {
    Write-Host "  ✗ PostgreSQL não está rodando" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ POSTGRESQL CONFIGURADO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Informações de Conexão:" -ForegroundColor Cyan
Write-Host "  Host: localhost" -ForegroundColor White
Write-Host "  Porta: $DB_PORT" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host "  Usuário: $DB_USER" -ForegroundColor White
Write-Host "  Senha: $DB_PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "String de Conexão:" -ForegroundColor Cyan
Write-Host "  postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}" -ForegroundColor White
Write-Host ""
Write-Host "Para conectar via psql:" -ForegroundColor Cyan
Write-Host "  docker exec -it $DB_CONTAINER psql -U $DB_USER -d $DB_NAME" -ForegroundColor White
Write-Host ""
Write-Host "Próximo passo: Execute o script 2-setup-keycloak.ps1" -ForegroundColor Yellow
Write-Host ""
