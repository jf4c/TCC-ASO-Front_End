# 🎲 Artificial Story Oracle

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Angular](https://img.shields.io/badge/Angular-19.2-red.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Plataforma para criação de histórias de RPG com geração de conteúdo por IA**

[🚀 Quick Start](#-quick-start) • [📖 Documentação](./Doc) • [🛠️ Scripts](./scripts)

</div>

---

## 📋 Sobre o Projeto

Artificial Story Oracle é uma plataforma web para criação e gerenciamento de campanhas de RPG, personagens e mundos ficcionais, com geração de conteúdo assistida por inteligência artificial.

### ✨ Funcionalidades Principais

- 🎭 **Gerenciamento de Personagens** - Criação, edição e visualização de personagens
- 🌍 **Mundos Ficcionais** - Criação de cenários e ambientações
- 📜 **Campanhas** - Organização de aventuras e histórias
- 🤖 **IA Generativa** - Geração de conteúdo com inteligência artificial
- 🔐 **Autenticação** - Sistema completo via Keycloak com tema personalizado

---

## 🚀 Quick Start

### Pré-requisitos

- **Docker Desktop** (v20.10+)
- **Node.js** (v18+)
- **PowerShell** (5.1+)

### Setup Automático (Recomendado)

```powershell
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd artificial-story-oracle

# 2. Executar setup completo
.\scripts\0-setup-all.ps1

# 3. Iniciar aplicação
.\scripts\5-start-app.ps1
```

**Pronto!** A aplicação estará disponível em http://localhost:4200

### Credenciais de Teste

- **Usuário:** `admin-aso`
- **Senha:** `Admin@123`

---

## 📦 Scripts Disponíveis

Todos os scripts estão na pasta `scripts/`:

| Script | Descrição |
|--------|-----------|
| `0-setup-all.ps1` | 🎯 **Setup completo automático** |
| `1-setup-keycloak.ps1` | Criar e iniciar Keycloak |
| `2-configure-realm.ps1` | Configurar realm e usuários |
| `3-deploy-theme.ps1` | Aplicar tema personalizado |
| `4-install-dependencies.ps1` | Instalar dependências npm |
| `5-start-app.ps1` | Iniciar aplicação |
| `check-status.ps1` | Verificar status dos serviços |
| `stop-all.ps1` | Parar todos os serviços |
| `clean-all.ps1` | Limpar e resetar ambiente |

📚 **Documentação completa:** [scripts/README.md](./scripts/README.md)

---

## 🏗️ Arquitetura

### Stack Tecnológica

- **Frontend:** Angular 19.2
- **Autenticação:** Keycloak
- **Estilização:** TailwindCSS + SCSS
- **HTTP Client:** HttpClient (Angular)

### Estrutura do Projeto

```
src/
├── app/
│   ├── core/                 # Serviços principais e guards
│   │   ├── auth/            # Autenticação Keycloak
│   │   └── layout/          # Layout da aplicação
│   ├── features/            # Módulos por funcionalidade
│   │   ├── character/       # Gestão de personagens
│   │   ├── campaign/        # Gestão de campanhas
│   │   ├── home/           # Página inicial
│   │   └── settings/       # Configurações
│   ├── shared/             # Componentes compartilhados
│   └── theme/              # Configuração de temas
├── environments/           # Variáveis de ambiente
└── styles/                # Estilos globais
```

---

## 🔧 Desenvolvimento

### Comandos Angular CLI

```bash
# Iniciar servidor de desenvolvimento
ng serve
# ou
npm start

# Build para produção
ng build

# Executar testes
ng test

# Gerar componente
ng generate component nome-componente

# Gerar serviço
ng generate service nome-servico
```

### Variáveis de Ambiente

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5174/api',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'artificial-story-oracle',
    clientId: 'aso-frontend',
  },
}
```

---

## 🎨 Tema Personalizado Keycloak

O projeto inclui um tema personalizado para o Keycloak com visual medieval/RPG:

- 🎨 Design de pergaminho
- 🖼️ Logo personalizado
- 🇧🇷 Traduções em português
- 🎭 Identidade visual do projeto

**Localização:** `keycloak-theme-aso/`

---

## 📖 Documentação

Documentação completa disponível em `Doc/`:

- **Arquitetura:** [Doc/geral/Doc_Architecture.md](./Doc/geral/Doc_Architecture.md)
- **Guia de Desenvolvimento:** [Doc/geral/Doc_Development_Guide.md](./Doc/geral/Doc_Development_Guide.md)
- **Features:** [Doc/features/](./Doc/features/)
- **Keycloak:** [Doc/geral/Keycloak_Setup_Guide.md](./Doc/geral/Keycloak_Setup_Guide.md)

---

## 🐛 Troubleshooting

### Problemas Comuns

1. **Docker não está rodando**
   ```powershell
   # Abrir Docker Desktop e aguardar inicializar
   ```

2. **Tema não aparece**
   ```powershell
   # Limpar cache do navegador (Ctrl+Shift+Del)
   # Re-aplicar tema
   .\scripts\3-deploy-theme.ps1
   ```

3. **Porta 8080 em uso**
   ```powershell
   # Descobrir processo
   netstat -ano | findstr :8080
   # Parar processo
   Stop-Process -Id <PID> -Force
   ```

4. **Verificar status geral**
   ```powershell
   .\scripts\check-status.ps1
   ```

📚 **Guia completo:** [scripts/README.md](./scripts/README.md)

---

## 🌐 URLs Importantes

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Aplicação | http://localhost:4200 | Frontend Angular |
| Keycloak Admin | http://localhost:8080/admin | Console administrativo |
| Login Realm | http://localhost:8080/realms/artificial-story-oracle/account | Tela de login |

---

## 👥 Usuários Padrão

### Usuário Admin
- **Username:** `admin-aso`
- **Password:** `Admin@123`
- **Roles:** admin, player, game-master

### Keycloak Admin
- **Username:** `admin`
- **Password:** `admin`

---

## 🔄 Atualizar Projeto

```powershell
# Puxar últimas mudanças
git pull origin main

# Atualizar dependências
npm install

# Re-aplicar tema (se necessário)
.\scripts\3-deploy-theme.ps1
```

---

## 🧹 Limpar Ambiente

```powershell
# Resetar tudo (remove containers e dependências)
.\scripts\clean-all.ps1

# Reconfigurar do zero
.\scripts\0-setup-all.ps1
```

---

## 📄 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.

---

## 👨‍💻 Desenvolvimento

**Projeto desenvolvido como Trabalho de Conclusão de Curso**

Para mais informações, consulte a documentação completa em `Doc/`.

---

<div align="center">

**[⬆ Voltar ao topo](#-artificial-story-oracle)**

Made with ❤️ and ☕

</div>
