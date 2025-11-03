# 🔐 Configuração do Keycloak - Artificial Story Oracle

## 📋 Índice
1. [Instalação do Keycloak](#instalação-do-keycloak)
2. [Criação do Realm](#criação-do-realm)
3. [Configuração do Client](#configuração-do-client)
4. [Criação de Usuários](#criação-de-usuários)
5. [Configuração de Roles](#configuração-de-roles)
6. [Testando a Integração](#testando-a-integração)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Instalação do Keycloak

### Opção 1: Docker (Recomendado)

```bash
# Baixar e iniciar Keycloak
docker run -d --name keycloak -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

### Opção 2: Instalação Manual

1. Baixe o Keycloak em: https://www.keycloak.org/downloads
2. Extraia o arquivo
3. Execute:
   ```bash
   cd keycloak-[version]
   bin/kc.bat start-dev  # Windows
   # ou
   bin/kc.sh start-dev   # Linux/Mac
   ```

### Primeiro Acesso

1. Acesse: `http://localhost:8080`
2. Clique em "Administration Console"
3. Login:
   - **Username:** `admin`
   - **Password:** `admin`

---

## 🌐 Criação do Realm

### Passo 1: Criar Novo Realm

1. No menu lateral esquerdo, clique em **"Keycloak"** (dropdown no topo)
2. Clique em **"Create realm"**
3. Preencha:
   - **Realm name:** `artificial-story-oracle`
   - **Enabled:** ✅ (marcado)
4. Clique em **"Create"**

### Passo 2: Configurações do Realm

1. Vá em **Realm Settings**
2. Aba **"General"**:
   - **Display name:** `Artificial Story Oracle`
   - **HTML Display name:** `<b>Artificial Story Oracle</b>`
   - **Frontend URL:** deixe em branco (desenvolvimento)

3. Aba **"Login"**:
   - ✅ **User registration:** Habilitado (permite auto-registro)
   - ✅ **Forgot password:** Habilitado
   - ✅ **Remember me:** Habilitado
   - ✅ **Login with email:** Habilitado

4. Aba **"Email"** (opcional para desenvolvimento):
   - Configure SMTP se quiser testar emails
   - Para dev, pode deixar em branco

5. Clique em **"Save"**

---

## 🔧 Configuração do Client

### Passo 1: Criar Client

1. No menu lateral, clique em **"Clients"**
2. Clique em **"Create client"**
3. Aba **"General Settings"**:
   - **Client type:** `OpenID Connect`
   - **Client ID:** `aso-frontend`
   - **Name:** `Artificial Story Oracle Frontend`
   - **Description:** `Cliente Angular do ASO`
4. Clique em **"Next"**

### Passo 2: Capability Config

1. Marque:
   - ✅ **Standard flow:** Enabled (Authorization Code Flow)
   - ❌ **Direct access grants:** Disabled
   - ❌ **Implicit flow:** Disabled
2. Clique em **"Next"**

### Passo 3: Login Settings

Preencha as URLs de redirecionamento:

```
Root URL:                http://localhost:4200
Home URL:                http://localhost:4200
Valid redirect URIs:     http://localhost:4200/*
                         http://localhost:4200
Valid post logout URIs:  http://localhost:4200/*
                         http://localhost:4200
Web origins:             http://localhost:4200
                         +
```

**Importante:** O `+` em Web Origins permite todos os Valid redirect URIs.

4. Clique em **"Save"**

### Passo 4: Configurações Adicionais

1. Após salvar, vá em **"Settings"** do client
2. Role até **"Advanced"** → **"Advanced settings"**:
   - **Access Token Lifespan:** `5 minutes` (padrão)
   - **Client Session Idle:** `30 minutes`
   - **Client Session Max:** `10 hours`

3. **Proof Key for Code Exchange (PKCE):**
   - **PKCE Code Challenge Method:** `S256` (mais seguro)

4. Clique em **"Save"**

---

## 👥 Criação de Usuários

### Criar Usuário Administrador

1. No menu lateral, clique em **"Users"**
2. Clique em **"Add user"**
3. Preencha:
   - **Username:** `admin-aso`
   - **Email:** `admin@aso.com`
   - **First name:** `Admin`
   - **Last name:** `ASO`
   - ✅ **Email verified:** Marcado
   - ✅ **Enabled:** Marcado
4. Clique em **"Create"**

### Definir Senha

1. Clique no usuário criado
2. Vá na aba **"Credentials"**
3. Clique em **"Set password"**
4. Preencha:
   - **Password:** `Admin@123`
   - **Password confirmation:** `Admin@123`
   - ❌ **Temporary:** Desmarque (senha permanente)
5. Clique em **"Save"**
6. Confirme em **"Save password"**

### Criar Usuário de Teste

Repita o processo acima para criar um usuário comum:
- **Username:** `player-test`
- **Email:** `player@aso.com`
- **Password:** `Player@123`

---

## 🎭 Configuração de Roles

### Criar Roles do Realm

1. No menu lateral, clique em **"Realm roles"**
2. Clique em **"Create role"**

#### Role: admin
- **Role name:** `admin`
- **Description:** `Administrador do sistema`
- Clique em **"Save"**

#### Role: player
- **Role name:** `player`
- **Description:** `Jogador comum`
- Clique em **"Save"**

#### Role: game-master
- **Role name:** `game-master`
- **Description:** `Mestre de jogo`
- Clique em **"Save"**

### Atribuir Roles aos Usuários

#### Para admin-aso:
1. Vá em **"Users"** → Clique em `admin-aso`
2. Aba **"Role mapping"**
3. Clique em **"Assign role"**
4. Selecione: `admin`, `player`, `game-master`
5. Clique em **"Assign"**

#### Para player-test:
1. Vá em **"Users"** → Clique em `player-test`
2. Aba **"Role mapping"**
3. Clique em **"Assign role"**
4. Selecione: `player`
5. Clique em **"Assign"**

---

## ✅ Testando a Integração

### 1. Verificar Configurações do Frontend

Certifique-se que o arquivo `environment.ts` está correto:

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

### 2. Iniciar Aplicação Angular

```bash
npm start
```

### 3. Testar Fluxo de Login

1. Acesse `http://localhost:4200`
2. Você deve ser redirecionado para `/login` (sem estar autenticado)
3. Clique em **"Entrar com Keycloak"**
4. Será redirecionado para a tela de login do Keycloak
5. Faça login com:
   - **Username:** `admin-aso`
   - **Password:** `Admin@123`
6. Após login, será redirecionado de volta para `/home`
7. Verifique se o nome do usuário aparece no header
8. Clique no ícone do usuário para ver o menu
9. Teste o **"Sair"**

### 4. Verificar Token no Console

Abra o DevTools e no console digite:

```javascript
// Verificar se está logado
const authService = ng.probe(document.body).injector.get('AuthService')
await authService.isLoggedIn()

// Ver token
await authService.getToken()
```

---

## 🔍 Troubleshooting

### Erro: "CORS Policy"

**Problema:** Requisições bloqueadas por CORS.

**Solução:**
1. No Keycloak, vá em **"Clients"** → `aso-frontend` → **"Settings"**
2. Em **"Web origins"**, adicione:
   ```
   http://localhost:4200
   +
   ```
3. Salve

### Erro: "Invalid redirect URI"

**Problema:** URL de redirecionamento não está configurada.

**Solução:**
1. Verifique **"Valid redirect URIs"** no client
2. Deve conter: `http://localhost:4200/*`
3. Certifique-se que termina com `/*`

### Erro: "Client not found"

**Problema:** Client ID incorreto.

**Solução:**
1. Verifique o **Client ID** no Keycloak: `aso-frontend`
2. Confira o `environment.ts`:
   ```typescript
   clientId: 'aso-frontend'
   ```

### Usuário não consegue fazer login

**Problema:** Usuário desabilitado ou email não verificado.

**Solução:**
1. Vá em **"Users"** → selecione o usuário
2. Certifique-se:
   - ✅ **Enabled:** Marcado
   - ✅ **Email verified:** Marcado

### Token expira muito rápido

**Problema:** Token JWT expira em poucos minutos.

**Solução:**
1. Vá em **"Clients"** → `aso-frontend` → **"Advanced"**
2. Ajuste **"Access Token Lifespan"** para `30 minutes`
3. Ou configure no **Realm Settings** → **"Tokens"**

### Keycloak não inicia

**Problema:** Porta 8080 em uso.

**Solução Docker:**
```bash
# Parar container
docker stop keycloak

# Iniciar em outra porta
docker run -d --name keycloak -p 8081:8080 ...
```

**Solução Manual:**
```bash
# Mudar porta no arquivo standalone.xml ou usar variável
kc.bat start-dev --http-port=8081
```

---

## 📚 Recursos Adicionais

- **Documentação Oficial:** https://www.keycloak.org/docs/latest/
- **Admin Guide:** https://www.keycloak.org/docs/latest/server_admin/
- **Securing Angular Apps:** https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter

---

## 🔒 Segurança em Produção

### ⚠️ IMPORTANTE para Deploy:

1. **Mudar senhas padrão:**
   - Admin do Keycloak
   - Todos os usuários de teste

2. **HTTPS obrigatório:**
   - Configure SSL/TLS no Keycloak
   - Use certificados válidos

3. **Configurar Email:**
   - SMTP para recuperação de senha
   - Verificação de email

4. **Ajustar URLs:**
   - Atualizar `environment.prod.ts`
   - Atualizar Valid redirect URIs no client

5. **Backup:**
   - Fazer backup regular do banco do Keycloak
   - Exportar configurações do Realm

6. **Rate Limiting:**
   - Configurar proteção contra força bruta
   - **Realm Settings** → **"Security defenses"**

---

**Versão:** 1.0  
**Data:** 1º de Novembro de 2025  
**Status:** ✅ Configuração Completa
