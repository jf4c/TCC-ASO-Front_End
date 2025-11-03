# 🎨 Troubleshooting do Tema Keycloak ASO

## 🔍 Problema: Tema não está sendo aplicado

### Sintomas
- A tela de login aparece com o tema padrão do Keycloak (branco/azul)
- Não mostra o pergaminho nem o logo personalizado
- Aparece erro "An internal server error has occurred"

---

## ✅ Checklist de Verificação

### 1. Verificar se o tema foi copiado corretamente

```powershell
# Verificar arquivos no container
docker exec keycloak ls -la /opt/keycloak/themes/

# Deve mostrar a pasta 'aso-theme'
```

Se não aparecer `aso-theme`, execute novamente:
```powershell
.\deploy-theme-keycloak.ps1
```

### 2. Verificar estrutura do tema

```powershell
docker exec keycloak ls -R /opt/keycloak/themes/aso-theme/
```

Deve ter:
```
aso-theme/
├── login/
│   ├── theme.properties
│   ├── login.ftl
│   ├── template.ftl
│   └── resources/
│       ├── css/
│       │   ├── aso-custom.css
│       │   └── login.css
│       └── img/
│           ├── logo.png
│           └── corpo.png
└── common/
    └── resources/
```

### 3. Verificar configuração no Realm

1. Acesse: http://localhost:8080/admin
2. Login: `admin` / `admin`
3. Selecione o realm: **artificial-story-oracle**
4. Vá em: **Realm Settings** > **Themes**
5. Verifique:
   - **Login theme:** `aso-theme`
   - **Account theme:** `aso-theme` (opcional)
   - **Email theme:** `aso-theme` (opcional)

Se estiver diferente, altere e clique em **Save**.

### 4. Limpar cache do Keycloak

```powershell
# Reiniciar container
docker restart keycloak

# Aguardar 30 segundos
Start-Sleep -Seconds 30
```

### 5. Limpar cache do navegador

1. Pressione `Ctrl + Shift + Del`
2. Marque "Imagens e arquivos em cache"
3. Clique em "Limpar dados"
4. Ou teste em modo anônimo/privado

---

## 🐛 Erros Comuns

### Erro: "Failed to load theme"

**Causa:** Arquivo `theme.properties` não encontrado ou com erro de sintaxe.

**Solução:**
```powershell
# Verificar arquivo
docker exec keycloak cat /opt/keycloak/themes/aso-theme/login/theme.properties

# Deve mostrar as propriedades corretamente
```

Se não mostrar nada ou der erro, re-execute:
```powershell
.\deploy-theme-keycloak.ps1
```

### Erro: "Template not found"

**Causa:** Arquivos `.ftl` (FreeMarker) ausentes ou com erro.

**Solução:**
```powershell
# Verificar templates
docker exec keycloak ls /opt/keycloak/themes/aso-theme/login/*.ftl
```

Deve listar:
- `login.ftl`
- `template.ftl`

### CSS não está sendo aplicado

**Causa:** Path incorreto no `theme.properties` ou CSS não foi copiado.

**Solução:**
```powershell
# Verificar CSS
docker exec keycloak cat /opt/keycloak/themes/aso-theme/login/resources/css/aso-custom.css
```

Se der erro de "file not found", re-execute o deploy.

### Imagens não aparecem

**Causa:** Imagens não foram copiadas ou path incorreto.

**Solução:**
```powershell
# Verificar imagens
docker exec keycloak ls /opt/keycloak/themes/aso-theme/login/resources/img/

# Deve listar: logo.png, corpo.png, etc
```

---

## 🔧 Soluções Rápidas

### Opção 1: Re-deploy completo

```powershell
# Remover tema antigo
docker exec keycloak rm -rf /opt/keycloak/themes/aso-theme

# Re-copiar tema
.\deploy-theme-keycloak.ps1
```

### Opção 2: Verificar logs

```powershell
# Ver logs do Keycloak
docker logs keycloak --tail 50

# Procurar por erros relacionados a tema
docker logs keycloak 2>&1 | Select-String "theme"
```

### Opção 3: Aplicar tema manualmente

1. Acesse: http://localhost:8080/admin
2. Login: `admin` / `admin`
3. Selecione: **artificial-story-oracle**
4. **Realm Settings** > **Themes**
5. **Login theme:** Selecione `aso-theme` no dropdown
6. **Save**
7. Limpe cache e recarregue

---

## 🎯 Teste Final

Após aplicar as correções, teste:

1. **Acesse a página de login:**
   ```
   http://localhost:8080/realms/artificial-story-oracle/account
   ```

2. **Ou pela aplicação Angular:**
   ```powershell
   npm start
   # Acesse http://localhost:4200
   # Clique em "Login"
   ```

3. **Verificar elementos:**
   - ✅ Fundo escuro (não branco)
   - ✅ Pergaminho aparece
   - ✅ Logo ASO no topo
   - ✅ Campos com estilo personalizado
   - ✅ Botão vermelho "ENTRAR"

---

## 📋 Checklist de Deploy em Produção

Para produção, certifique-se:

- [ ] Tema empacotado em um JAR
- [ ] JAR colocado em `/opt/keycloak/providers/`
- [ ] Keycloak reiniciado com `kc.sh build`
- [ ] Tema selecionado no Realm
- [ ] HTTPS configurado
- [ ] Cache do CDN/proxy limpo

---

## 🆘 Ainda não funcionou?

### Verificação Detalhada

Execute este script para diagnóstico completo:

```powershell
Write-Host "=== DIAGNÓSTICO DO TEMA ASO ===" -ForegroundColor Cyan

# 1. Container rodando?
Write-Host "`n1. Status do container:" -ForegroundColor Yellow
docker ps --filter "name=keycloak" --format "{{.Names}} - {{.Status}}"

# 2. Tema existe?
Write-Host "`n2. Temas disponíveis:" -ForegroundColor Yellow
docker exec keycloak ls /opt/keycloak/themes/

# 3. Estrutura do tema
Write-Host "`n3. Estrutura do tema ASO:" -ForegroundColor Yellow
docker exec keycloak find /opt/keycloak/themes/aso-theme -type f

# 4. Configuração do realm
Write-Host "`n4. Configuração de temas do realm:" -ForegroundColor Yellow
$token = (Invoke-RestMethod -Uri "http://localhost:8080/realms/master/protocol/openid-connect/token" -Method POST -ContentType "application/x-www-form-urlencoded" -Body "username=admin&password=admin&grant_type=password&client_id=admin-cli").access_token
$headers = @{"Authorization" = "Bearer $token"}
$realm = Invoke-RestMethod -Uri "http://localhost:8080/admin/realms/artificial-story-oracle" -Headers $headers
Write-Host "  Login theme: $($realm.loginTheme)"
Write-Host "  Account theme: $($realm.accountTheme)"
Write-Host "  Email theme: $($realm.emailTheme)"

# 5. Logs recentes
Write-Host "`n5. Logs recentes (erros):" -ForegroundColor Yellow
docker logs keycloak --tail 20 2>&1 | Select-String -Pattern "ERROR|WARN|theme"

Write-Host "`n=== FIM DO DIAGNÓSTICO ===" -ForegroundColor Cyan
```

Se tudo estiver correto mas ainda não funcionar:
1. Tente um tema diferente primeiro (ex: `keycloak` padrão) para confirmar que o sistema de temas funciona
2. Verifique permissões dos arquivos no container
3. Consulte os logs completos: `docker logs keycloak > keycloak-logs.txt`

---

**Última atualização:** 3 de Novembro de 2025
