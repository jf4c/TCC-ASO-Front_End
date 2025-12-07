# Hotfix - Tela de Visualização de Personagem

## Problema
- Tela exibindo `[object Object]` ao invés dos nomes de raça e classe
- Imagem do personagem não carregando corretamente

## Causa Raiz
1. **API retorna formatos diferentes:**
   - **Listagem** (`GET /character`): `ancestry` e `class` são **strings**
   - **Detalhes** (`GET /character/{id}`): `ancestry` e `class` são **objetos** com `{id, name}`

2. **Imagem com path relativo** precisa ser concatenado com base URL

## Correções Aplicadas

### 1. `view-character.page.ts`
- ✅ Adicionado `import { environment }` 
- ✅ Criado `characterImageUrl()` computed para construir URL completa da imagem
- ✅ Corrigido tipo de `lockedFields` para `string[]`

### 2. `view-character.page.html`
- ✅ Template já estava correto: `{{ character()!.ancestry.name }}`
- ✅ Atualizado para usar `characterImageUrl()` ao invés de `character()!.image`

### 3. `home.page.ts`
- ✅ **Já estava correto** - mapeia corretamente strings da API de listagem

## Como Testar

1. **Pare o servidor Angular** (Ctrl+C no terminal)
2. **Limpe o cache:**
   ```powershell
   Remove-Item -Recurse -Force .angular
   ```
3. **Reinicie:**
   ```powershell
   npm start
   ```
4. **Limpe o cache do navegador:** Ctrl+Shift+R ou F12 > Network > "Disable cache"
5. **Acesse:** `http://localhost:4200/personagens/5d816e5a-e7c8-4aa0-95fe-cb41a781e21c`

## Resultado Esperado

```
NOME: Thorin
RAÇA: Hynne          ← Deve mostrar o nome, não [object Object]
CLASSE: Nobre        ← Deve mostrar o nome, não [object Object]
NÍVEL: 1
HP: 15
MANA: 8
```

### Atributos devem mostrar:
- FORÇA: 3 (+0)
- DESTREZA: 2 (-4)
- CONSTITUIÇÃO: 3 (-3)
- etc.

### Imagem:
- Deve carregar de `http://localhost:5174/assets/Character/mage5.png`

## Verificação da API

O endpoint está funcionando corretamente:
```powershell
curl http://localhost:5174/api/character/5d816e5a-e7c8-4aa0-95fe-cb41a781e21c
```

Retorna:
```json
{
  "id": "5d816e5a-e7c8-4aa0-95fe-cb41a781e21c",
  "name": "Thorin",
  "level": 1,
  "ancestry": {"id": "1837f3eb-0aa0-4b23-859c-4dffc78d4ba7", "name": "Hynne"},
  "class": {"id": "0f36dddc-8e3f-41ac-82e0-633218547fd1", "name": "Nobre"},
  "attributes": {...},
  "skills": [...]
}
```

## Notas Técnicas

- **Modelos de dados estão corretos:**
  - `Character` (listagem): ancestry/class são strings
  - `CharacterDetail` (detalhes): ancestry/class são objetos

- **Template binding está correto:**
  - Usa `.name` para extrair string do objeto
  
- **Se ainda aparecer `[object Object]`:**
  - Verifique console do navegador (F12) para erros
  - Confirme que não há versão antiga em cache
  - Verifique se hot reload está funcionando
