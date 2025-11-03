# ⚡ Quick Reference - ASO

## 🚀 Setup Inicial (Primeira Vez)

```powershell
# Setup completo em um comando
.\scripts\0-setup-all.ps1
```

## 💻 Uso Diário

```powershell
# Iniciar aplicação
.\scripts\6-start-app.ps1

# Verificar se tudo está OK
.\scripts\check-status.ps1

# Parar serviços
.\scripts\stop-all.ps1
```

## 🔑 Credenciais

**Aplicação:**
- Usuário: `admin-aso`
- Senha: `Admin@123`

**Keycloak Admin:**
- Usuário: `admin`
- Senha: `admin`

**PostgreSQL:**
- Database: `aso_db`
- Usuário: `aso_user`
- Senha: `aso_password`
- Porta: `5432`

## 🌐 URLs

- **App:** http://localhost:4200
- **PostgreSQL:** localhost:5432
- **Keycloak:** http://localhost:8080/admin

## 🆘 Problemas?

```powershell
# Verificar status
.\scripts\check-status.ps1

# Ver logs do Keycloak
docker logs keycloak

# Resetar tudo
.\scripts\clean-all.ps1
.\scripts\0-setup-all.ps1
```

## 📋 Comandos Docker

```powershell
# Ver containers
docker ps

# Iniciar PostgreSQL
docker start aso-postgres

# Iniciar Keycloak
docker start keycloak

# Parar PostgreSQL
docker stop aso-postgres

# Parar Keycloak
docker stop keycloak

# Ver logs PostgreSQL
docker logs aso-postgres

# Ver logs Keycloak
docker logs keycloak
```

## 📦 Comandos npm

```powershell
# Instalar dependências
npm install

# Iniciar dev server
npm start

# Build produção
npm run build

# Executar testes
npm test
```

## 🔧 Atualizar

```powershell
# Código
git pull origin main

# Dependências
npm install

# Tema
.\scripts\4-deploy-theme.ps1
```

## 📁 Estrutura

```
📁 artificial-story-oracle/
├── 📁 scripts/          # Scripts de automação
├── 📁 src/             # Código fonte
├── 📁 keycloak-theme-aso/ # Tema personalizado
├── 📁 Doc/             # Documentação
└── 📄 README.md        # Este arquivo
```

## 📖 Mais Informações

- **Setup Detalhado:** [scripts/README.md](./README.md)
- **Documentação Completa:** [../Doc/](../Doc/)
- **Arquitetura:** [../Doc/geral/Doc_Architecture.md](../Doc/geral/Doc_Architecture.md)
