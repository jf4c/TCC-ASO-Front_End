# 🎨 Tema Personalizado Keycloak - Artificial Story Oracle

## 📋 Visão Geral

Este documento explica como instalar e ativar o tema personalizado do ASO no Keycloak.

---

## 📁 Estrutura do Tema

```
keycloak-theme/
├── theme.properties         # Configuração principal do tema
└── login/
    ├── login.ftl           # Template da página de login
    └── resources/
        ├── css/
        │   └── login.css   # Estilos personalizados
        └── img/            # Imagens e logos (adicione aqui)
```

---

## 🚀 Instalação do Tema no Keycloak

### Opção 1: Docker (Recomendado)

#### Passo 1: Copiar Tema para o Container

```bash
# Navegue até a pasta do projeto
cd c:\Users\julio\Documents\Development\tcc\s2\artificial-story-oracle

# Copie a pasta do tema para dentro do container Keycloak
docker cp keycloak-theme keycloak:/opt/keycloak/themes/aso-theme
```

#### Passo 2: Reiniciar o Keycloak

```bash
docker restart keycloak
```

#### Passo 3: Verificar se o Tema foi Carregado

```bash
# Entre no container
docker exec -it keycloak bash

# Liste os temas disponíveis
ls /opt/keycloak/themes/

# Deve aparecer: aso-theme
```

---

### Opção 2: Instalação Manual

Se você instalou o Keycloak manualmente (não Docker):

#### Passo 1: Localizar Pasta de Temas

```bash
# Normalmente está em:
# Windows: C:\keycloak-[version]\themes\
# Linux/Mac: /opt/keycloak/themes/
```

#### Passo 2: Copiar Tema

```bash
# Copie a pasta keycloak-theme para dentro de themes/
# Renomeie para aso-theme

# Exemplo Windows:
xcopy /E /I keycloak-theme "C:\keycloak-25.0.0\themes\aso-theme"

# Exemplo Linux/Mac:
cp -r keycloak-theme /opt/keycloak/themes/aso-theme
```

#### Passo 3: Reiniciar Keycloak

```bash
# Windows
bin\kc.bat stop
bin\kc.bat start-dev

# Linux/Mac
bin/kc.sh stop
bin/kc.sh start-dev
```

---

## ⚙️ Ativando o Tema no Realm

### Passo 1: Acessar Admin Console

1. Acesse: `http://localhost:8080`
2. Login: `admin` / `admin`
3. Selecione o realm: **artificial-story-oracle**

### Passo 2: Configurar Tema de Login

1. No menu lateral, clique em **"Realm Settings"**
2. Vá na aba **"Themes"**
3. Configure:
   - **Login theme:** `aso-theme`
   - **Account theme:** `keycloak` (padrão)
   - **Admin Console theme:** `keycloak` (padrão)
   - **Email theme:** `keycloak` (padrão)
4. Clique em **"Save"**

### Passo 3: Testar o Tema

1. Abra uma aba anônima do navegador
2. Acesse: `http://localhost:4200`
3. Você será redirecionado automaticamente para o Keycloak
4. A tela de login deve aparecer com o tema personalizado do ASO

---

## 🎨 Personalização Adicional

### Adicionar Logo

1. Salve sua logo em: `keycloak-theme/login/resources/img/logo.png`
2. Edite `keycloak-theme/login/login.ftl`
3. Adicione antes do `#kc-page-title`:

```html
<div id="kc-logo">
    <img src="${url.resourcesPath}/img/logo.png" alt="Artificial Story Oracle" style="max-width: 200px; margin-bottom: 1rem;">
</div>
```

### Alterar Cores

Edite `keycloak-theme/login/resources/css/login.css`:

```css
:root {
  --primary: #8b5cf6;        /* Roxo principal */
  --primary-dark: #7c3aed;   /* Roxo escuro */
  --secondary: #ec4899;      /* Rosa */
  --background: #0f172a;     /* Fundo escuro */
  --surface: #1e293b;        /* Superfície cards */
}
```

### Alterar Textos

1. Crie arquivo: `keycloak-theme/login/messages/messages_pt_BR.properties`
2. Adicione traduções personalizadas:

```properties
loginAccountTitle=Bem-vindo ao Artificial Story Oracle
usernameOrEmail=Usuário ou E-mail
password=Senha
doLogIn=Entrar
rememberMe=Lembrar de mim
doForgotPassword=Esqueceu a senha?
noAccount=Não tem conta?
doRegister=Criar conta
```

---

## 🔍 Troubleshooting

### Tema não aparece na lista

**Problema:** Tema `aso-theme` não aparece nas opções de tema.

**Solução:**
1. Verifique se a pasta está em `themes/aso-theme`
2. Verifique se o arquivo `theme.properties` existe
3. Reinicie o Keycloak
4. Limpe o cache do navegador (Ctrl+Shift+Del)

### CSS não está sendo aplicado

**Problema:** Tema aparece mas os estilos não funcionam.

**Solução:**
1. Verifique se `login.css` está em `login/resources/css/`
2. Verifique o `theme.properties`:
   ```properties
   styles=css/login.css
   ```
3. Limpe cache do Keycloak:
   ```bash
   docker exec -it keycloak rm -rf /opt/keycloak/data/tmp
   docker restart keycloak
   ```

### Tema quebrado/com erros

**Problema:** Tela de login aparece quebrada.

**Solução:**
1. Verifique logs do Keycloak:
   ```bash
   docker logs keycloak
   ```
2. Reverta para tema padrão:
   - Realm Settings → Themes → Login theme: `keycloak`
3. Corrija os erros no `.ftl` ou `.css`
4. Reaplique o tema

### Docker não copia tema

**Problema:** `docker cp` falha ou não copia.

**Solução:**
```bash
# Verifique se o container está rodando
docker ps

# Se não estiver, inicie:
docker start keycloak

# Tente copiar novamente
docker cp keycloak-theme keycloak:/opt/keycloak/themes/aso-theme

# Verifique se copiou
docker exec -it keycloak ls /opt/keycloak/themes/
```

---

## 📸 Preview do Tema

O tema personalizado inclui:

- ✅ Gradiente de fundo (azul escuro → cinza)
- ✅ Card centralizado com bordas arredondadas
- ✅ Inputs estilizados com foco roxo
- ✅ Botão com gradiente roxo → rosa
- ✅ Animações suaves (fade-in, hover)
- ✅ Design responsivo (mobile-friendly)
- ✅ Paleta de cores consistente com o projeto ASO

---

## 🔄 Atualizando o Tema

Sempre que modificar o tema:

```bash
# 1. Salve suas alterações em keycloak-theme/

# 2. Copie novamente para o container
docker cp keycloak-theme keycloak:/opt/keycloak/themes/aso-theme

# 3. Limpe o cache do Keycloak
docker exec -it keycloak rm -rf /opt/keycloak/data/tmp

# 4. Reinicie
docker restart keycloak

# 5. Limpe cache do navegador (Ctrl+Shift+Del)
```

---

## 📚 Referências

- **Keycloak Themes Guide:** https://www.keycloak.org/docs/latest/server_development/#_themes
- **FreeMarker Template:** https://freemarker.apache.org/docs/
- **Customizing Login Pages:** https://www.keycloak.org/docs/latest/server_development/#_login_theme

---

## ✅ Checklist de Instalação

- [ ] Tema copiado para `/opt/keycloak/themes/aso-theme`
- [ ] Keycloak reiniciado
- [ ] Tema `aso-theme` aparece na lista de temas
- [ ] Tema ativado em Realm Settings → Themes → Login theme
- [ ] Testado em aba anônima do navegador
- [ ] Página de login aparece com design personalizado
- [ ] Login funciona corretamente
- [ ] Redirecionamento para aplicação funciona

---

**Versão:** 1.0  
**Data:** 1º de Novembro de 2025  
**Status:** ✅ Tema Criado
