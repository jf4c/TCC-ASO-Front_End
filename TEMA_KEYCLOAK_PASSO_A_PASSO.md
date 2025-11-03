# 🚀 Passo a Passo: Aplicar Tema Personalizado no Keycloak

## O que vamos fazer?

Instalar o tema personalizado "Artificial Story Oracle" no Keycloak para que a tela de login fique com o design do pergaminho.

---

## ⚙️ Pré-requisitos

- Docker Desktop rodando
- Container Keycloak criado (se não tiver, veja seção "Criar Keycloak" abaixo)
- PowerShell

---

## 📝 Opção 1: Script Automático (Recomendado)

### Passo 1: Executar o script de deploy

```powershell
.\deploy-theme-keycloak.ps1
```

Esse script irá:
1. ✅ Verificar se o Docker está rodando
2. ✅ Verificar se o container Keycloak existe e está ativo
3. ✅ Copiar todos os arquivos do tema para o container
4. ✅ Configurar o realm para usar o tema
5. ✅ Reiniciar o Keycloak

### Passo 2: Aguardar e testar

Após o script terminar (≈ 40 segundos):

1. Acesse: http://localhost:4200
2. Clique em "Login" ou "Entrar"
3. Você será redirecionado para a tela de login do Keycloak
4. **Agora deve aparecer o tema personalizado** (pergaminho, logo, fundo escuro)

---

## 📝 Opção 2: Manual (Se o script não funcionar)

### Passo 1: Verificar o container

```powershell
# Ver se está rodando
docker ps --filter "name=keycloak"

# Se não estiver, inicie
docker start keycloak
```

### Passo 2: Copiar o tema

```powershell
# Remover tema antigo (se existir)
docker exec keycloak rm -rf /opt/keycloak/themes/aso-theme

# Copiar novo tema
docker cp keycloak-theme-aso keycloak:/opt/keycloak/themes/aso-theme
```

### Passo 3: Reiniciar Keycloak

```powershell
docker restart keycloak
```

Aguarde 30 segundos.

### Passo 4: Aplicar tema no Admin Console

1. Acesse: http://localhost:8080/admin
2. Login: `admin` / `admin`
3. **Selecione o realm:** `artificial-story-oracle` (dropdown no topo esquerdo)
4. Vá em **Realm Settings** (menu lateral)
5. Clique na aba **Themes**
6. Em **Login theme**, selecione: `aso-theme`
7. Clique em **Save**

### Passo 5: Limpar cache do navegador

Pressione: `Ctrl + Shift + Del`
- Marque: "Imagens e arquivos em cache"
- Período: "Última hora"
- Clique em "Limpar dados"

Ou teste em uma janela anônima.

### Passo 6: Testar

Acesse novamente: http://localhost:4200 e faça login.

---

## 🆘 Criar Keycloak (se não existir)

Se você não tem o container do Keycloak:

```powershell
# Criar e iniciar Keycloak
docker run -d `
  --name keycloak `
  -p 8080:8080 `
  -e KEYCLOAK_ADMIN=admin `
  -e KEYCLOAK_ADMIN_PASSWORD=admin `
  quay.io/keycloak/keycloak:latest `
  start-dev
```

Aguarde 30-40 segundos para o Keycloak inicializar.

Depois execute:
```powershell
# Configurar realm, client e usuários
.\setup-keycloak.ps1

# Aplicar tema
.\deploy-theme-keycloak.ps1
```

---

## 🔍 Verificação

### Como saber se funcionou?

A tela de login deve ter:

✅ **Fundo:** Gradiente escuro (não branco)  
✅ **Pergaminho:** Imagem de pergaminho como fundo do formulário  
✅ **Logo:** Logo "Artificial Story Oracle" no topo  
✅ **Título:** "Entrar na sua conta" em fonte serifada marrom  
✅ **Campos:** Inputs com borda marrom e fundo bege  
✅ **Botão:** Botão vermelho "ENTRAR" com gradiente  

### Se NÃO funcionou:

Execute o diagnóstico:

```powershell
# Verificar se o tema foi copiado
docker exec keycloak ls /opt/keycloak/themes/

# Deve listar: aso-theme
```

Se não aparecer, o tema não foi copiado. Re-execute:
```powershell
.\deploy-theme-keycloak.ps1
```

---

## 🧹 Limpar tudo e começar do zero

Se nada funcionar, remova tudo e recrie:

```powershell
# Parar e remover container
docker stop keycloak
docker rm keycloak

# Recriar
docker run -d `
  --name keycloak `
  -p 8080:8080 `
  -e KEYCLOAK_ADMIN=admin `
  -e KEYCLOAK_ADMIN_PASSWORD=admin `
  quay.io/keycloak/keycloak:latest `
  start-dev

# Aguardar 40 segundos
Start-Sleep -Seconds 40

# Configurar
.\setup-keycloak.ps1

# Aplicar tema
.\deploy-theme-keycloak.ps1
```

---

## 📋 Checklist Final

Antes de testar, confirme:

- [ ] Container Keycloak está rodando: `docker ps`
- [ ] Tema foi copiado: `docker exec keycloak ls /opt/keycloak/themes/aso-theme`
- [ ] Realm está usando o tema (ver no Admin Console)
- [ ] Cache do navegador foi limpo
- [ ] Testou em modo anônimo/privado

---

## 🎯 Resultado Esperado

**Antes (tema padrão):**
- Fundo branco/cinza claro
- Design simples do Keycloak
- Sem identidade visual

**Depois (tema ASO):**
- Fundo escuro com gradiente
- Pergaminho medieval
- Logo ASO no topo
- Design temático de RPG

---

## 💡 Dicas

1. **Cache é o maior vilão:** Sempre limpe o cache ou use modo anônimo para testar
2. **Logs são seus amigos:** Se der erro, veja os logs: `docker logs keycloak`
3. **Admin Console é sua ferramenta:** Use http://localhost:8080/admin para verificar configurações
4. **Seja paciente:** O Keycloak pode levar alguns segundos para aplicar mudanças

---

## 📞 Ainda com problemas?

Se seguiu todos os passos e ainda não funcionou:

1. **Capture os logs:**
   ```powershell
   docker logs keycloak > keycloak-logs.txt
   ```

2. **Verifique a estrutura do tema:**
   ```powershell
   docker exec keycloak find /opt/keycloak/themes/aso-theme -type f
   ```

3. **Teste com outro tema primeiro:**
   - No Admin Console, mude para `keycloak` (tema padrão)
   - Se funcionar, o problema é no tema ASO
   - Se não funcionar, o problema é na configuração do Keycloak

4. **Consulte:** `Doc\geral\Keycloak_Theme_Troubleshooting.md`

---

**Boa sorte!** 🎲✨
