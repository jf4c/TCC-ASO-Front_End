# 🚀 Guia de Setup - Artificial Story Oracle

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Setup Rápido (Automático)](#setup-rápido-automático)
3. [Setup Manual (Passo a Passo)](#setup-manual-passo-a-passo)
4. [Scripts Disponíveis](#scripts-disponíveis)
5. [Troubleshooting](#troubleshooting)
6. [Comandos Úteis](#comandos-úteis)

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### 1. **Docker Desktop**
- Download: https://www.docker.com/products/docker-desktop
- Versão mínima: 20.10+
- **IMPORTANTE:** Docker deve estar rodando antes de executar os scripts

### 2. **Node.js**
- Download: https://nodejs.org/
- Versão recomendada: **v18.x** ou superior
- Inclui npm automaticamente

### 3. **PowerShell**
- Windows 10/11: Já vem instalado
- Versão mínima: PowerShell 5.1

### 4. **Git** (opcional, para clonar o repositório)
- Download: https://git-scm.com/downloads

---

## 🎯 Setup Rápido (Automático)

### Opção 1: Setup Completo em Um Comando

```powershell
# Na raiz do projeto, execute:
.\scripts\0-setup-all.ps1
```

Este script irá:
1. ✅ Criar e configurar o PostgreSQL
2. ✅ Criar e configurar o Keycloak
3. ✅ Configurar realm, client e usuários
4. ✅ Aplicar o tema personalizado
5. ✅ Instalar todas as dependências
6. ✅ (Opcional) Iniciar a aplicação

**Tempo estimado:** 5-10 minutos

---

## 📝 Setup Manual (Passo a Passo)

Se preferir executar cada etapa individualmente:

### Passo 1: Clonar o Repositório (se necessário)

```powershell
git clone <url-do-repositorio>
cd artificial-story-oracle
```

### Passo 1: Setup do PostgreSQL

```powershell
.\scripts\1-setup-postgres.ps1
```

**O que faz:**
- Verifica se Docker está rodando
- Cria container PostgreSQL
- Configura database `aso_db`
- Cria usuário `aso_user`
- Testa conectividade

**Credenciais:**
- Database: `aso_db`
- Usuário: `aso_user`
- Senha: `aso_password`
- Porta: `5432`

**Tempo:** ~1 minuto

### Passo 2: Setup do Keycloak

```powershell
.\scripts\2-setup-keycloak.ps1
```

**O que faz:**
- Verifica se Docker está rodando
- Cria container Keycloak
- Aguarda inicialização
- Testa conectividade

**Tempo:** ~2 minutos

### Passo 3: Configurar Realm

```powershell
.\scripts\3-configure-realm.ps1
```

**O que faz:**
- Cria realm `artificial-story-oracle`
- Configura client `aso-frontend`
- Cria roles (admin, player, game-master)
- Cria usuário admin-aso

**Tempo:** ~30 segundos

### Passo 4: Aplicar Tema Personalizado

```powershell
.\scripts\4-deploy-theme.ps1
```

**O que faz:**
- Copia arquivos do tema para o container
- Aplica tema ao realm
- Reinicia Keycloak

**Tempo:** ~1 minuto

### Passo 5: Instalar Dependências

```powershell
.\scripts\5-install-dependencies.ps1
```

**O que faz:**
- Verifica Node.js e npm
- Instala dependências do package.json
- Valida instalação

**Tempo:** 2-5 minutos (depende da internet)

### Passo 6: Iniciar Aplicação

```powershell
.\scripts\6-start-app.ps1
```

**O que faz:**
- Verifica pré-requisitos
- Inicia servidor de desenvolvimento
- Abre em http://localhost:4200

---

## 📦 Scripts Disponíveis

### Scripts Principais

| Script | Descrição | Uso |
|--------|-----------|-----|
| `0-setup-all.ps1` | Setup completo automático | Primeira instalação |
| `1-setup-postgres.ps1` | Criar container PostgreSQL | Setup inicial |
| `2-setup-keycloak.ps1` | Criar container Keycloak | Setup inicial |
| `3-configure-realm.ps1` | Configurar realm e usuários | Setup inicial |
| `4-deploy-theme.ps1` | Aplicar tema personalizado | Setup inicial / Atualizar tema |
| `5-install-dependencies.ps1` | Instalar dependências npm | Setup inicial / Atualizar deps |
| `6-start-app.ps1` | Iniciar aplicação | Uso diário |

### Scripts Utilitários

| Script | Descrição | Uso |
|--------|-----------|-----|
| `check-status.ps1` | Verificar status de tudo | Diagnóstico |
| `stop-all.ps1` | Parar Keycloak | Encerrar serviços |
| `clean-all.ps1` | Limpar e resetar tudo | Recomeçar do zero |

---

## 🎮 Como Usar a Aplicação

### 1. Iniciar os Serviços

```powershell
# PostgreSQL e Keycloak já devem estar rodando (docker ps)
# Se não estiverem, inicie manualmente:
docker start aso-postgres
docker start keycloak

# Iniciar aplicação Angular
.\scripts\6-start-app.ps1
# OU
npm start
```

### 2. Acessar a Aplicação

Abra o navegador em: **http://localhost:4200**

### 3. Fazer Login

**Credenciais de teste:**
- **Usuário:** `admin-aso`
- **Senha:** `Admin@123`

### 4. Verificar Tema

A tela de login deve ter:
- ✅ Fundo escuro
- ✅ Pergaminho como formulário
- ✅ Logo "Artificial Story Oracle"
- ✅ Textos em português
- ✅ Botão vermelho "ENTRAR"

---

## 🐛 Troubleshooting

### Problema 1: Docker não está rodando

**Erro:** `Docker não está respondendo`

**Solução:**
1. Abra o Docker Desktop
2. Aguarde inicializar (ícone na bandeja do sistema)
3. Execute novamente o script

### Problema 2: Porta 8080 já está em uso

**Erro:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Solução:**
```powershell
# Descobrir o que está usando a porta
netstat -ano | findstr :8080

# Parar o processo (substitua <PID>)
Stop-Process -Id <PID> -Force

# Ou use outra porta (edite o script)
```

### Problema 3: Tema não aparece

**Sintomas:** Tela de login padrão do Keycloak (branca)

**Solução:**
```powershell
# 1. Limpar cache do navegador (Ctrl+Shift+Del)
# 2. Testar em modo anônimo
# 3. Re-aplicar tema
.\scripts\3-deploy-theme.ps1

# 4. Verificar no Admin Console
# http://localhost:8080/admin
# Realm Settings > Themes > Login theme = aso-theme
```

### Problema 4: Dependências não instalam

**Erro:** `npm install` falha

**Solução:**
```powershell
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# Ou use o script de limpeza
.\scripts\clean-all.ps1
.\scripts\4-install-dependencies.ps1
```

### Problema 5: Aplicação não conecta no Keycloak

**Erro:** `Failed to load Keycloak configuration`

**Solução:**
1. Verifique se Keycloak está rodando: `docker ps`
2. Verifique o realm: http://localhost:8080/realms/artificial-story-oracle
3. Verifique `src/environments/environment.ts`:
   ```typescript
   keycloak: {
     url: 'http://localhost:8080',
     realm: 'artificial-story-oracle',
     clientId: 'aso-frontend',
   }
   ```

### Problema 6: Erro de permissão ao copiar tema

**Erro:** `Permission denied` ao executar `3-deploy-theme.ps1`

**Solução:**
```powershell
# Recriar container do zero
.\scripts\clean-all.ps1
.\scripts\0-setup-all.ps1
```

---

## 🔧 Comandos Úteis

### Docker

```powershell
# Ver containers rodando
docker ps

# Ver todos os containers
docker ps -a

# Iniciar Keycloak
docker start keycloak

# Parar Keycloak
docker stop keycloak

# Ver logs do Keycloak
docker logs keycloak

# Ver logs em tempo real
docker logs -f keycloak

# Remover container
docker stop keycloak
docker rm keycloak

# Entrar no container (bash)
docker exec -it keycloak bash
```

### npm

```powershell
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test

# Verificar versões
npm --version
node --version
```

### Keycloak

```powershell
# Admin Console
Start-Process "http://localhost:8080/admin"

# Tela de login do realm
Start-Process "http://localhost:8080/realms/artificial-story-oracle/account"

# Obter token via API
$tokenBody = "username=admin-aso&password=Admin@123&grant_type=password&client_id=aso-frontend"
Invoke-RestMethod -Uri "http://localhost:8080/realms/artificial-story-oracle/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body $tokenBody
```

---

## 📊 Verificar Status

```powershell
# Executar verificação completa
.\scripts\check-status.ps1
```

Isso irá verificar:
- ✅ Docker instalado e rodando
- ✅ Container PostgreSQL ativo
- ✅ PostgreSQL respondendo
- ✅ Container Keycloak ativo
- ✅ Keycloak respondendo
- ✅ Realm configurado
- ✅ Node.js instalado
- ✅ Dependências instaladas

---

## 🔄 Atualizar o Projeto

### Atualizar Código

```powershell
# Puxar últimas mudanças
git pull origin main

# Reinstalar dependências (se package.json mudou)
npm install
```

### Atualizar Tema

```powershell
# Re-aplicar tema
.\scripts\4-deploy-theme.ps1
```

### Resetar Tudo

```powershell
# Limpar e reconfigurar
.\scripts\clean-all.ps1
.\scripts\0-setup-all.ps1
```

---

## 🌐 URLs Importantes

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Aplicação | http://localhost:4200 | Frontend Angular |
| PostgreSQL | localhost:5432 | Banco de dados |
| Keycloak Admin | http://localhost:8080/admin | Console administrativo |
| Keycloak Login | http://localhost:8080/realms/artificial-story-oracle/account | Tela de login do realm |
| API Realm | http://localhost:8080/realms/artificial-story-oracle | Configuração do realm |

---

## 👥 Usuários Padrão

### Admin
- **Usuário:** `admin-aso`
- **Senha:** `Admin@123`
- **Roles:** admin, player, game-master
- **Email:** admin@aso.com

### Keycloak Admin
- **Usuário:** `admin`
- **Senha:** `admin`
- **Acesso:** http://localhost:8080/admin

### PostgreSQL
- **Database:** `aso_db`
- **Usuário:** `aso_user`
- **Senha:** `aso_password`
- **Porta:** `5432`
- **Connection String:** `postgresql://aso_user:aso_password@localhost:5432/aso_db`

---

## 📚 Estrutura de Pastas

```
artificial-story-oracle/
├── scripts/                    # Scripts de automação
│   ├── 0-setup-all.ps1        # Setup completo
│   ├── 1-setup-postgres.ps1   # Criar PostgreSQL
│   ├── 2-setup-keycloak.ps1   # Criar Keycloak
│   ├── 3-configure-realm.ps1  # Configurar realm
│   ├── 4-deploy-theme.ps1     # Aplicar tema
│   ├── 5-install-dependencies.ps1
│   ├── 6-start-app.ps1        # Iniciar app
│   ├── check-status.ps1       # Verificar status
│   ├── stop-all.ps1           # Parar serviços
│   └── clean-all.ps1          # Limpar tudo
├── keycloak-theme-aso/        # Tema personalizado
│   └── login/
│       ├── login.ftl
│       ├── template.ftl
│       ├── theme.properties
│       ├── messages/
│       │   └── messages_pt_BR.properties
│       └── resources/
│           ├── css/
│           └── img/
├── src/                       # Código fonte Angular
├── Doc/                       # Documentação
├── package.json
└── README.md
```

---

## ⚠️ Notas Importantes

### Produção

Este setup é para **desenvolvimento local**. Para produção:

1. **Keycloak:**
   - Use banco de dados PostgreSQL/MySQL (não H2)
   - Configure HTTPS
   - Mude senhas padrão
   - Configure backup

2. **Angular:**
   - Build de produção: `npm run build`
   - Configure `environment.prod.ts`
   - Use servidor web (nginx, Apache)

3. **Segurança:**
   - Mude todas as senhas
   - Configure CORS adequadamente
   - Use certificados SSL válidos

### Desenvolvimento em Equipe

Se múltiplas pessoas vão trabalhar:

1. Cada um deve executar o setup localmente
2. Não commitar `node_modules` ou `.angular`
3. Usar variáveis de ambiente para configurações
4. Documentar mudanças no tema ou configuração

---

## 🆘 Suporte

Se encontrar problemas não documentados:

1. Execute: `.\scripts\check-status.ps1`
2. Verifique logs: `docker logs keycloak`
3. Consulte a documentação em `Doc/`
4. Verifique issues no repositório

---

## 📄 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.

---

**Última atualização:** 3 de Novembro de 2025  
**Versão dos Scripts:** 1.0
