# 🚀 Guia Rápido - Keycloak Setup

## ⚡ Setup Rápido (5 minutos)

### 1. Iniciar Keycloak (Docker)
```bash
docker run -d --name keycloak -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
```

### 2. Acessar Admin Console
- URL: `http://localhost:8080`
- Login: `admin` / `admin`

### 3. Criar Realm
1. Clicar no dropdown "Keycloak" (topo esquerdo)
2. **"Create realm"**
3. Nome: `artificial-story-oracle`
4. **"Create"**

### 4. Criar Client
1. **"Clients"** → **"Create client"**
2. Client ID: `aso-frontend`
3. **"Next"**
4. Marcar: ✅ **Standard flow**
5. **"Next"**
6. Configurar URLs:
   ```
   Root URL: http://localhost:4200
   Valid redirect URIs: http://localhost:4200/*
   Web origins: +
   ```
7. **"Save"**

### 5. Criar Usuário de Teste
1. **"Users"** → **"Add user"**
2. Preencher:
   - Username: `admin-aso`
   - Email: `admin@aso.com`
   - ✅ Email verified
3. **"Create"**
4. Aba **"Credentials"** → **"Set password"**
   - Password: `Admin@123`
   - ❌ Temporary
5. **"Save"**

### 6. Criar Roles (opcional)
1. **"Realm roles"** → **"Create role"**
2. Criar:
   - `admin`
   - `player`
   - `game-master`
3. Atribuir roles ao usuário

### 7. Testar
```bash
npm start
```
- Acesse: `http://localhost:4200`
- Clique em "Entrar"
- Login: `admin-aso` / `Admin@123`

---

## ✅ Checklist de Verificação

- [ ] Keycloak rodando na porta 8080
- [ ] Realm `artificial-story-oracle` criado
- [ ] Client `aso-frontend` configurado
- [ ] Usuário de teste criado
- [ ] Angular rodando na porta 4200
- [ ] Login funcionando

---

## 🔧 Arquivos Criados no Projeto

```
src/
├── environments/
│   ├── environment.ts          # Config de desenvolvimento
│   └── environment.prod.ts     # Config de produção
├── app/
│   ├── app.config.ts            # ✅ Atualizado com Keycloak
│   ├── app.routes.ts            # ✅ Atualizado com authGuard
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.service.ts      # Serviço de autenticação
│   │   │   ├── auth.guard.ts        # Guard de rotas
│   │   │   ├── auth.interceptor.ts  # Interceptor HTTP
│   │   │   └── keycloak-init.factory.ts
│   │   └── layout/components/header/
│   │       ├── header.component.ts  # ✅ Atualizado
│   │       └── header.component.html # ✅ Atualizado
│   └── features/auth/pages/login/
│       ├── login.page.ts
│       ├── login.page.html
│       └── login.page.scss
public/
└── silent-check-sso.html
```

---

## 📚 Documentação Completa

Ver: `Doc/geral/Keycloak_Setup_Guide.md`

---

**Tempo estimado:** 5-10 minutos  
**Última atualização:** 1º de Novembro de 2025
