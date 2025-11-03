# ✅ Checklist de Validação - Setup ASO

Use este checklist para validar que tudo está funcionando corretamente.

---

## 📋 Pré-Setup (Antes de Começar)

- [ ] Docker Desktop instalado
- [ ] Docker Desktop **rodando** (ícone na bandeja)
- [ ] Node.js instalado (v18+)
- [ ] PowerShell disponível
- [ ] Está na pasta raiz do projeto

**Verificar:**
```powershell
docker --version
node --version
npm --version
```

---

## 🚀 Após Executar Setup (0-setup-all.ps1)

### Docker e Keycloak

- [ ] Container `keycloak` está rodando
  ```powershell
  docker ps
  # Deve listar: keycloak
  ```

- [ ] Keycloak responde na porta 8080
  ```powershell
  # Abrir no navegador:
  http://localhost:8080
  ```

- [ ] Admin Console acessível
  ```powershell
  # Login: admin / admin
  http://localhost:8080/admin
  ```

### Realm e Configurações

- [ ] Realm `artificial-story-oracle` existe
  ```powershell
  # No Admin Console:
  # Selecionar realm no dropdown superior esquerdo
  ```

- [ ] Client `aso-frontend` configurado
  ```powershell
  # Admin Console > Clients
  # Deve listar: aso-frontend
  ```

- [ ] Usuário `admin-aso` existe
  ```powershell
  # Admin Console > Users
  # Buscar: admin-aso
  ```

- [ ] Roles criadas
  ```powershell
  # Admin Console > Realm roles
  # Deve ter: admin, player, game-master
  ```

### Tema Personalizado

- [ ] Tema aplicado no realm
  ```powershell
  # Admin Console > Realm Settings > Themes
  # Login theme: aso-theme
  ```

- [ ] Arquivos do tema no container
  ```powershell
  docker exec keycloak ls /opt/keycloak/themes/aso-theme
  # Deve listar: login, common, etc
  ```

- [ ] Tela de login personalizada
  ```powershell
  # Abrir em modo anônimo:
  http://localhost:8080/realms/artificial-story-oracle/account
  
  # Deve mostrar:
  # ✓ Pergaminho como fundo
  # ✓ Logo ASO no topo
  # ✓ Textos em português
  # ✓ Botão vermelho "ENTRAR"
  ```

### Dependências Angular

- [ ] `node_modules` instalado
  ```powershell
  Test-Path "node_modules"
  # Deve retornar: True
  ```

- [ ] `package-lock.json` criado
  ```powershell
  Test-Path "package-lock.json"
  # Deve retornar: True
  ```

- [ ] Sem erros de dependências
  ```powershell
  npm list --depth=0
  # Não deve ter erros críticos
  ```

---

## 🌐 Após Iniciar Aplicação (5-start-app.ps1)

### Servidor de Desenvolvimento

- [ ] Servidor iniciou sem erros
  ```
  # Terminal deve mostrar:
  # ✓ Angular CLI ...
  # ✓ Listening on localhost:4200
  ```

- [ ] Aplicação acessível
  ```powershell
  # Abrir no navegador:
  http://localhost:4200
  ```

- [ ] Não há erros no console do navegador
  ```
  F12 > Console
  # Não deve ter erros vermelhos
  ```

### Autenticação

- [ ] Redireciona para login ao acessar rota protegida

- [ ] Tela de login do Keycloak aparece corretamente

- [ ] Consegue fazer login
  ```
  Usuário: admin-aso
  Senha: Admin@123
  ```

- [ ] Após login, redireciona para aplicação

- [ ] Nome do usuário aparece no header/menu

- [ ] Consegue fazer logout

---

## 🧪 Testes Funcionais

### Navegação

- [ ] Todas as rotas acessíveis
  - [ ] /home
  - [ ] /characters
  - [ ] /campaigns
  - [ ] /settings

- [ ] Menu de navegação funciona

- [ ] Botões e links respondem

### CRUD de Personagens

- [ ] Consegue listar personagens
- [ ] Consegue criar novo personagem
- [ ] Consegue visualizar personagem
- [ ] Consegue editar personagem
- [ ] Consegue deletar personagem

### CRUD de Campanhas

- [ ] Consegue listar campanhas
- [ ] Consegue criar nova campanha
- [ ] Consegue visualizar campanha
- [ ] Consegue editar campanha
- [ ] Consegue deletar campanha

---

## 🔍 Verificação com Scripts

### check-status.ps1

```powershell
.\scripts\check-status.ps1
```

**Deve mostrar:**
- ✅ Docker instalado e rodando
- ✅ Container Keycloak ativo
- ✅ Keycloak respondendo
- ✅ Realm configurado
- ✅ Node.js instalado
- ✅ Dependências instaladas
- ✅ Tema aplicado

---

## ⚠️ Se Algo Falhou

### Problema com Docker
```powershell
# Reiniciar Docker Desktop
# Aguardar inicialização completa
# Executar novamente
```

### Problema com Keycloak
```powershell
# Ver logs
docker logs keycloak

# Reiniciar container
docker restart keycloak
```

### Problema com Tema
```powershell
# Limpar cache do navegador (Ctrl+Shift+Del)
# Testar em modo anônimo
# Re-aplicar tema
.\scripts\3-deploy-theme.ps1
```

### Problema com Dependências
```powershell
# Limpar e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Resetar Tudo
```powershell
.\scripts\clean-all.ps1
.\scripts\0-setup-all.ps1
```

---

## ✅ Checklist Resumido

**Setup Inicial:**
- [ ] Pré-requisitos instalados
- [ ] Scripts executados sem erro
- [ ] Keycloak rodando
- [ ] Realm configurado
- [ ] Tema aplicado
- [ ] Dependências instaladas

**Funcionamento:**
- [ ] Aplicação inicia
- [ ] Login funciona
- [ ] Navegação OK
- [ ] CRUDs funcionam
- [ ] Logout funciona

**Visual:**
- [ ] Tema personalizado na tela de login
- [ ] Textos em português
- [ ] Layout responsivo
- [ ] Sem erros no console

---

## 📊 Status Final

Se **TODOS** os itens acima estão marcados:

🎉 **SETUP COMPLETO E VALIDADO!**

Pronto para desenvolvimento ou uso em outro PC!

---

**Data:** ___/___/______  
**Validado por:** _________________  
**Observações:** 
```
_______________________________________________
_______________________________________________
_______________________________________________
```
