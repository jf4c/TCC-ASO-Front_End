# 👥 Script de Criação de Usuários de Teste

Este script cria múltiplos usuários no Keycloak para facilitar o teste do sistema de amigos.

---

## 🚀 Como Usar

### Uso Básico (10 usuários)
```powershell
cd scripts
.\create-test-users.ps1
```

### Criar número específico de usuários
```powershell
# Criar 5 usuários
.\create-test-users.ps1 -NumUsers 5

# Criar todos os 20 usuários disponíveis
.\create-test-users.ps1 -NumUsers 20
```

### Com parâmetros personalizados
```powershell
.\create-test-users.ps1 `
    -NumUsers 10 `
    -KeycloakUrl "http://localhost:8080" `
    -Realm "artificial-story-oracle" `
    -AdminUser "admin" `
    -AdminPassword "admin" `
    -DefaultPassword "Test@123"
```

---

## 📋 Parâmetros

| Parâmetro | Descrição | Padrão |
|-----------|-----------|--------|
| `NumUsers` | Quantidade de usuários a criar | `10` |
| `KeycloakUrl` | URL do Keycloak | `http://localhost:8080` |
| `Realm` | Nome do realm | `artificial-story-oracle` |
| `AdminUser` | Usuário admin do Keycloak | `admin` |
| `AdminPassword` | Senha do admin | `admin` |
| `DefaultPassword` | Senha para os novos usuários | `Test@123` |

---

## 👤 Usuários Criados

O script cria até 20 usuários com os seguintes dados:

| NickName | Nome Completo | Email |
|----------|---------------|-------|
| admin_test | Admin Teste | admin.test@aso.com |
| jogador01 | João Silva | joao.silva@aso.com |
| jogador02 | Maria Santos | maria.santos@aso.com |
| jogador03 | Pedro Costa | pedro.costa@aso.com |
| jogador04 | Ana Oliveira | ana.oliveira@aso.com |
| mestre_rpg | Carlos Mestre | carlos.mestre@aso.com |
| warrior_99 | Bruno Guerreiro | bruno.warrior@aso.com |
| mage_power | Lucia Maga | lucia.mage@aso.com |
| rogue_ninja | Rafael Ladino | rafael.rogue@aso.com |
| healer_good | Fernanda Curandeira | fernanda.healer@aso.com |
| tank_strong | Marcos Tanque | marcos.tank@aso.com |
| archer_pro | Julia Arqueira | julia.archer@aso.com |
| bard_songs | Gabriel Bardo | gabriel.bard@aso.com |
| paladin_luz | Amanda Paladina | amanda.paladin@aso.com |
| necro_dark | Diego Necromante | diego.necro@aso.com |
| druid_nat | Patricia Druida | patricia.druid@aso.com |
| monk_zen | Lucas Monge | lucas.monk@aso.com |
| ranger_wild | Beatriz Ranger | beatriz.ranger@aso.com |
| wizard_old | Roberto Mago | roberto.wizard@aso.com |
| cleric_holy | Carla Clériga | carla.cleric@aso.com |

**Todos os usuários têm a senha padrão:** `Test@123`

---

## 🧪 Testando o Sistema de Amigos

### 1. Criar usuários de teste
```powershell
.\create-test-users.ps1 -NumUsers 10
```

### 2. Login com diferentes usuários

Abra múltiplas janelas anônimas do navegador:

**Janela 1 - Seu usuário principal:**
- Username: `jf4c`
- Password: sua senha

**Janela 2 - Usuário de teste:**
- Username: `jogador01`
- Password: `Test@123`

**Janela 3 - Outro usuário de teste:**
- Username: `mestre_rpg`
- Password: `Test@123`

### 3. Testar funcionalidades

**Na Janela 1 (jf4c):**
1. Vá em "Buscar Amigos"
2. Busque por "jogador"
3. Envie convite para "jogador01"
4. Busque "mestre"
5. Envie convite para "mestre_rpg"

**Na Janela 2 (jogador01):**
1. Veja a notificação de convite pendente (badge)
2. Vá em "Convites"
3. Aceite o convite de "jf4c"
4. Verifique em "Meus Amigos" que jf4c aparece

**Na Janela 3 (mestre_rpg):**
1. Veja a notificação de convite
2. Vá em "Convites"
3. Recuse o convite de "jf4c"

**Voltar na Janela 1 (jf4c):**
1. Verifique que "jogador01" aparece em "Meus Amigos"
2. Teste remover a amizade (com confirmação)
3. Em "Convites" → "Enviados", veja o status do convite para "mestre_rpg"

---

## 🔧 Troubleshooting

### Erro: "Não foi possível obter token"
- Verifique se o Keycloak está rodando em `http://localhost:8080`
- Verifique se as credenciais de admin estão corretas
- Rode: `docker ps` para verificar se o container está ativo

### Erro: "Usuário já existe"
- Normal se você já rodou o script antes
- Use `-NumUsers` diferente para criar mais usuários
- Ou delete os usuários existentes no Keycloak Admin Console

### Script não executa
```powershell
# Permitir execução de scripts (se necessário)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Rodar o script
.\create-test-users.ps1
```

---

## 🗑️ Limpar Usuários de Teste

Para deletar todos os usuários de teste criados:

```powershell
# TODO: Criar script de limpeza
# Por enquanto, use o Keycloak Admin Console:
# 1. Acesse http://localhost:8080
# 2. Login com admin/admin
# 3. Vá em Users
# 4. Delete os usuários de teste manualmente
```

---

## 📝 Notas

- **Senha padrão:** Todos os usuários têm a senha `Test@123` (pode ser alterada no parâmetro)
- **Email verificado:** Todos os usuários são criados com email já verificado
- **Enabled:** Todos os usuários são criados já habilitados
- **Temporary password:** `false` - não precisa trocar senha no primeiro login

---

## 🔐 Segurança

⚠️ **ATENÇÃO:** Este script é apenas para **ambiente de desenvolvimento**!

- Não use em produção
- As senhas são simples e previsíveis
- Os emails são fictícios
- Os dados são para teste apenas

---

## 🎯 Casos de Uso

1. **Teste de busca:** Buscar usuários por diferentes nicknames
2. **Teste de convites:** Enviar múltiplos convites
3. **Teste de aceitação:** Aceitar convites de diferentes usuários
4. **Teste de recusa:** Recusar convites
5. **Teste de remoção:** Remover amizades existentes
6. **Teste de badges:** Verificar contadores de notificações
7. **Teste de lista:** Ver lista de amigos com múltiplos usuários
8. **Teste de filtro:** Filtrar amigos na lista local

---

**Criado em:** 10/11/2025  
**Versão:** 1.0
