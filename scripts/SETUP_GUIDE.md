# 🚀 Setup Rápido - Artificial Story Oracle

Guia completo para configurar o projeto em um novo PC.

---

## 📋 Pré-requisitos

Antes de começar, instale as seguintes ferramentas:

### Obrigatórios:
- ✅ **Node.js** v18+ → https://nodejs.org/
- ✅ **.NET SDK** 8.0+ → https://dotnet.microsoft.com/download
- ✅ **Docker Desktop** → https://www.docker.com/products/docker-desktop
- ✅ **EF Core Tools** → `dotnet tool install --global dotnet-ef`

### Opcionais:
- Git → https://git-scm.com/

---

## 🎯 Setup Automático (Recomendado)

Execute **UM** dos seguintes comandos no PowerShell:

### Opção 1: Setup Completo com Verificação
```powershell
cd scripts
.\0-check-prerequisites.ps1    # Verifica pré-requisitos
.\0-setup-all.ps1               # Setup completo automático
```

### Opção 2: Setup Manual Passo a Passo
```powershell
cd scripts
.\0-check-prerequisites.ps1     # 1. Verifica ferramentas
.\1-setup-postgres.ps1          # 2. Inicia PostgreSQL (Docker)
.\2-setup-keycloak.ps1          # 3. Inicia Keycloak (Docker)
.\3-configure-realm.ps1         # 4. Cria realm e client
.\4-deploy-theme.ps1            # 5. Aplica tema customizado
.\1.5-setup-backend.ps1         # 6. Configura backend + migrations
.\5-install-dependencies.ps1    # 7. Instala dependências npm
.\6-start-app.ps1               # 8. Inicia aplicação Angular
```

---

## 📁 Estrutura de Pastas Esperada

```
📁 TCC/
├── 📁 TCC-ASO-Back_End/          ← Repositório do Backend (.NET)
└── 📁 artificial-story-oracle/   ← Repositório do Frontend (Angular)
    └── 📁 scripts/               ← Scripts de setup
```

**Importante:** Os scripts assumem que o backend está em `../TCC-ASO-Back_End`.  
Se estiver em outro local, ajuste o parâmetro:

```powershell
.\1.5-setup-backend.ps1 -BackendPath "C:\caminho\do\backend"
```

---

## 🔧 Configurações Manuais (Se Necessário)

### 1. Backend - appsettings.Development.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=aso_db;Username=aso_user;Password=aso_password"
  },
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/aso-realm",
    "Audience": "aso-angular-client",
    "RequireHttpsMetadata": false
  }
}
```

### 2. Frontend - environment.ts

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7000/api',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'aso-realm',
    clientId: 'aso-angular-client'
  }
};
```

---

## 🐳 Serviços Docker

### Verificar Status
```powershell
.\scripts\check-status.ps1
```

### Parar Serviços
```powershell
.\scripts\stop-all.ps1
```

### Limpar e Reiniciar
```powershell
.\scripts\clean-all.ps1
.\scripts\0-setup-all.ps1
```

---

## 🎮 Executar Aplicação

### Frontend (Angular)
```powershell
npm start
# Acesse: http://localhost:4200
```

### Backend (.NET)
```powershell
cd ..\TCC-ASO-Back_End
dotnet run
# API: https://localhost:7000
# Swagger: https://localhost:7000/swagger
```

### Keycloak Admin
```
URL: http://localhost:8080/admin
Usuário: admin
Senha: admin
```

---

## 📦 Conteúdo dos Scripts

| Script | Descrição |
|--------|-----------|
| `0-check-prerequisites.ps1` | ✅ Verifica ferramentas instaladas |
| `0-setup-all.ps1` | 🚀 Setup completo automático |
| `1-setup-postgres.ps1` | 🐘 Inicia PostgreSQL no Docker |
| `2-setup-keycloak.ps1` | 🔐 Inicia Keycloak no Docker |
| `3-configure-realm.ps1` | ⚙️ Configura realm e client |
| `4-deploy-theme.ps1` | 🎨 Aplica tema customizado |
| `1.5-setup-backend.ps1` | 🔧 Setup backend + migrations |
| `5-install-dependencies.ps1` | 📦 Instala node_modules |
| `6-start-app.ps1` | ▶️ Inicia Angular dev server |
| `check-status.ps1` | 📊 Verifica status dos serviços |
| `stop-all.ps1` | ⏸️ Para todos os serviços |
| `clean-all.ps1` | 🧹 Remove containers e volumes |
| `create-test-users.ps1` | 👥 Cria usuários de teste |

---

## 🐛 Troubleshooting

### Erro: "Docker não está rodando"
**Solução:** Inicie o Docker Desktop e aguarde inicializar.

### Erro: "EF Core Tools não encontrado"
**Solução:** 
```powershell
dotnet tool install --global dotnet-ef
dotnet tool update --global dotnet-ef
```

### Erro: "Porta 5432 já em uso"
**Solução:** Outro PostgreSQL está rodando. Pare-o ou mude a porta no docker-compose.yml

### Erro: "Porta 8080 já em uso"
**Solução:** Outro serviço está usando a porta. Pare-o ou mude a porta do Keycloak.

### Erro: "Migrations falhou"
**Solução:**
```powershell
cd ..\TCC-ASO-Back_End
dotnet ef database drop    # Remove banco
dotnet ef database update  # Recria
```

### Erro: "npm install falhou"
**Solução:**
```powershell
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path package-lock.json -Force
npm cache clean --force
npm install
```

---

## 📚 Recursos Adicionais

- **Documentação Backend**: `../TCC-ASO-Back_End/README.md`
- **Documentação Keycloak**: `Doc/geral/Keycloak_Setup_Guide.md`
- **Arquitetura**: `Doc/geral/Doc_Architecture.md`
- **Features**: `Doc/features/`

---

## 🆘 Suporte

Em caso de problemas:

1. Execute `.\scripts\check-status.ps1` para diagnóstico
2. Verifique os logs:
   - Frontend: Console do terminal
   - Backend: Console do Visual Studio/Rider
   - Docker: `docker logs aso-postgres` ou `docker logs aso-keycloak`

3. Limpe tudo e reconfigure:
```powershell
.\scripts\clean-all.ps1
.\scripts\0-setup-all.ps1
```

---

## ✅ Checklist de Configuração

- [ ] Node.js instalado
- [ ] .NET SDK instalado
- [ ] Docker Desktop instalado e rodando
- [ ] EF Core Tools instalado
- [ ] Repositórios clonados (frontend + backend)
- [ ] PostgreSQL iniciado (Docker)
- [ ] Keycloak iniciado (Docker)
- [ ] Realm configurado
- [ ] Tema aplicado
- [ ] Backend migrations aplicadas
- [ ] Dependencies instaladas (npm)
- [ ] Frontend rodando (localhost:4200)
- [ ] Backend rodando (localhost:7000)
- [ ] Keycloak acessível (localhost:8080)

---

**Última atualização:** 10/11/2025  
**Versão:** 2.0
