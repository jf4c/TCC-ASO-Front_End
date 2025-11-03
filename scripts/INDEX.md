# 📁 Scripts - Índice

## 🎯 Scripts Principais (Ordem de Execução)

### 1️⃣ Setup Inicial

| # | Script | Descrição | Quando Usar |
|---|--------|-----------|-------------|
| **0** | `0-setup-all.ps1` | **Setup completo automático** | ⭐ Primeira instalação (recomendado) |
| 1 | `1-setup-postgres.ps1` | Criar container PostgreSQL | Setup manual - Passo 1 |
| 2 | `2-setup-keycloak.ps1` | Criar container Keycloak | Setup manual - Passo 2 |
| 3 | `3-configure-realm.ps1` | Configurar realm e usuários | Setup manual - Passo 3 |
| 4 | `4-deploy-theme.ps1` | Aplicar tema personalizado | Setup manual - Passo 4 / Atualizar tema |
| 5 | `5-install-dependencies.ps1` | Instalar dependências npm | Setup manual - Passo 5 / Atualizar deps |
| 6 | `6-start-app.ps1` | Iniciar aplicação | ⭐ Uso diário |

### 2️⃣ Scripts Utilitários

| Script | Descrição | Quando Usar |
|--------|-----------|-------------|
| `check-status.ps1` | Verificar status de tudo | Diagnóstico / Verificação |
| `stop-all.ps1` | Parar Keycloak | Finalizar trabalho |
| `clean-all.ps1` | Limpar e resetar tudo | ⚠️ Recomeçar do zero |

---

## 🚀 Quick Start

### Primeira Vez

```powershell
.\scripts\0-setup-all.ps1
```

### Uso Diário

```powershell
.\scripts\6-start-app.ps1
```

---

## 📚 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Guia completo com troubleshooting |
| `QUICK_REFERENCE.md` | Referência rápida de comandos |
| `INDEX.md` | Este arquivo (índice) |

---

## 🔍 Detalhes dos Scripts

### 0-setup-all.ps1 ⭐
**Setup completo automático**

Executa todos os passos em sequência:
1. Setup PostgreSQL
2. Setup Keycloak
3. Configurar Realm
4. Deploy Tema
5. Instalar Dependências
6. (Opcional) Iniciar App

**Tempo:** 5-10 minutos  
**Uso:** Primeira instalação ou reset completo

---

### 1-setup-postgres.ps1
**Criar container PostgreSQL**

- Verifica Docker
- Cria container PostgreSQL
- Configura database aso_db
- Cria usuário aso_user
- Aguarda inicialização
- Testa conectividade

**Tempo:** ~1 minuto  
**Porta:** 5432  
**Credenciais:** aso_user / aso_password

---

### 2-setup-keycloak.ps1
**Criar container Keycloak**

- Verifica Docker
- Cria container com Keycloak
- Aguarda inicialização
- Testa conectividade

**Tempo:** ~2 minutos  
**Porta:** 8080

---

### 3-configure-realm.ps1
**Configurar realm, client e usuários**

Cria:
- Realm: `artificial-story-oracle`
- Client: `aso-frontend`
- Roles: admin, player, game-master
- Usuário: admin-aso

**Tempo:** ~30 segundos  
**Requer:** Keycloak rodando

---

### 4-deploy-theme.ps1
**Aplicar tema personalizado**

- Copia arquivos do tema
- Aplica ao realm
- Reinicia Keycloak

**Tempo:** ~1 minuto  
**Requer:** Keycloak + Realm configurado

---

### 5-install-dependencies.ps1
**Instalar dependências npm**

- Verifica Node.js
- Executa `npm install`
- Valida instalação

**Tempo:** 2-5 minutos  
**Requer:** Node.js instalado

---

### 6-start-app.ps1 ⭐
**Iniciar servidor de desenvolvimento**

- Verifica dependências
- Verifica Keycloak
- Executa `npm start`

**Tempo:** ~10 segundos para iniciar  
**URL:** http://localhost:4200

---

### check-status.ps1
**Verificar status de tudo**

Verifica:
- ✅ Docker rodando
- ✅ Container PostgreSQL ativo
- ✅ PostgreSQL respondendo
- ✅ Container Keycloak ativo
- ✅ Keycloak respondendo
- ✅ Realm configurado
- ✅ Node.js instalado
- ✅ Dependências instaladas

**Tempo:** ~5 segundos  
**Uso:** Diagnóstico rápido

---

### stop-all.ps1
**Parar Keycloak e PostgreSQL**

- Para containers Docker
- Informa sobre app Angular

**Tempo:** ~2 segundos  
**Uso:** Finalizar trabalho diário

---

### clean-all.ps1 ⚠️
**Limpar e resetar tudo**

Remove:
- Container PostgreSQL
- Container Keycloak
- node_modules
- Caches

**Tempo:** ~30 segundos  
**Uso:** Reset completo / Resolver problemas graves

---

## 💡 Dicas

### Qual script usar?

**Primeira vez no PC:**
```powershell
.\scripts\0-setup-all.ps1
```

**Já configurado, quero trabalhar:**
```powershell
.\scripts\6-start-app.ps1
```

**Algo deu errado, não sei o que:**
```powershell
.\scripts\check-status.ps1
```

**Quero começar do zero:**
```powershell
.\scripts\clean-all.ps1
.\scripts\0-setup-all.ps1
```

**Atualizei o tema:**
```powershell
.\scripts\4-deploy-theme.ps1
```

**Atualizei package.json:**
```powershell
.\scripts\5-install-dependencies.ps1
```

---

## 🆘 Troubleshooting

**Script não executa:**
```powershell
# Permitir execução de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Erro de permissão:**
```powershell
# Executar PowerShell como Administrador
```

**Docker não encontrado:**
1. Instalar Docker Desktop
2. Iniciar Docker Desktop
3. Aguardar inicialização completa

**Porta 8080 em uso:**
```powershell
# Ver o que está usando
netstat -ano | findstr :8080
# Parar o processo
Stop-Process -Id <PID> -Force
```

---

## 📖 Mais Informações

- **Guia Completo:** [README.md](./README.md)
- **Quick Reference:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Documentação Projeto:** [../Doc/](../Doc/)

---

**Última atualização:** 3 de Novembro de 2025  
**Versão:** 1.0
