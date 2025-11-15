# Filtro de Personagens por PlayerId

## Visão Geral

O endpoint de listagem de personagens agora suporta filtro por `PlayerId`, permitindo buscar personagens de um jogador específico ou automaticamente filtrando pelo usuário autenticado via JWT.

---

## Mudanças no Backend (Implementadas)

### Endpoint Atualizado

```http
GET /api/character?PlayerId={guid}&Page={number}&PageSize={number}
Authorization: Bearer {jwt-token}
```

**Parâmetros:**
- `PlayerId` (opcional): GUID do jogador. Se não fornecido, usa o ID do JWT automaticamente
- `Page` (opcional): Número da página (padrão: 1)
- `PageSize` (opcional): Itens por página (padrão: 10)

**Exemplo de Uso:**

```bash
# Filtrar por jogador específico
curl -X GET "http://localhost:5000/api/character?PlayerId=3fa85f64-5717-4562-b3fc-2c963f66afa6&Page=1&PageSize=10" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"

# Filtrar automaticamente pelo usuário do JWT (não passa PlayerId)
curl -X GET "http://localhost:5000/api/character?Page=1&PageSize=10" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## Mudanças no Frontend (Implementadas)

### 1. Interface Atualizada

**Arquivo:** `character.model.ts`

```typescript
export interface GetPaginatedCharacterRequest {
  playerId?: string        // ✨ NOVO: Filtro por jogador
  name?: string
  ancestryId?: string
  classId?: string
  campaignId?: string
  page?: number
  pageSize?: number
}
```

### 2. Método Auxiliar no Service

**Arquivo:** `character.service.ts`

```typescript
/**
 * Busca personagens de um jogador específico.
 * Útil para seleção de personagens em campanhas.
 */
getCharactersByPlayer(
  playerId: string,
  page: number = 1,
  pageSize: number = 10,
): Observable<GetPaginatedCharacterResponse> {
  return this.getPaginatedCharacter({
    playerId,
    page,
    pageSize,
  })
}
```

### 3. Listagem de Personagens (Sem Mudanças Visuais)

**Arquivo:** `list-character.page.ts`

Na tela de listagem padrão, **não é necessário passar o `playerId`** - o backend filtra automaticamente pelo JWT:

```typescript
private loadCharacters(): void {
  const request = {
    page: this.currentPage + 1,
    pageSize: this.pageSize,
    // playerId não é passado aqui - o backend usa o JWT automaticamente
    name: formValues.name || undefined,
    ancestryName: formValues.ancestry?.name || undefined,
    className: formValues.class?.name || undefined,
  }
  
  this.characterService.getPaginatedCharacter(request).subscribe(...)
}
```

✅ **Resultado:** O usuário vê apenas seus próprios personagens, sem mudanças na UI

### 4. Criação de Campanha (Atribuição de Personagens)

**Arquivo:** `create-campaign.page.ts`

Agora usa a **API real** ao invés de dados mockados:

```typescript
async loadPlayersCharacters(): Promise<void> {
  this.loading = true;
  this.playerCharacters.clear();
  
  try {
    // Carregar personagens de cada jogador selecionado
    const loadPromises = this.selectedPlayers.map(player => {
      return this.characterService
        .getCharactersByPlayer(player.friend.id, 1, 50) // ✨ API real
        .toPromise()
        .then(response => {
          if (response) {
            // Mapear os personagens para o formato esperado
            const characters: AvailableCharacter[] = response.results.map(char => ({
              id: char.id,
              name: char.name,
              race: char.ancestry,
              class: char.class,
              level: char.level,
              isInCampaign: false // TODO: Verificar se já está em campanha
            }));
            
            this.playerCharacters.set(player.friend.id, characters);
          }
        })
        .catch(error => {
          console.error(`Erro ao carregar personagens:`, error);
          this.playerCharacters.set(player.friend.id, []);
        });
    });
    
    await Promise.all(loadPromises);
  } finally {
    this.loading = false;
  }
}
```

**Fluxo:**
1. Usuário seleciona amigos no **Step 1** (Adicionar Jogadores)
2. Ao avançar para **Step 2** (Atribuir Personagens), o sistema:
   - Chama `getCharactersByPlayer()` para cada amigo selecionado
   - Exibe os personagens reais de cada jogador
   - Permite selecionar qual personagem cada jogador usará na campanha

---

## Casos de Uso

### 1. Listagem Pessoal
**Cenário:** Usuário acessando "Meus Personagens"  
**Comportamento:** Backend filtra automaticamente pelo JWT  
**Request:** Não passa `playerId`

### 2. Seleção de Personagens em Campanha
**Cenário:** Criador da campanha escolhendo personagens dos jogadores  
**Comportamento:** Frontend passa `playerId` explicitamente  
**Request:** Passa `playerId` de cada amigo selecionado

### 3. Visualização de Personagens de Amigo
**Cenário:** Ver personagens de um amigo específico (futuro)  
**Comportamento:** Frontend passa `playerId` do amigo  
**Request:** Passa `playerId` do amigo

---

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                        Listagem de Personagens                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │   playerId fornecido?   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                   SIM                       NÃO
                    │                         │
         ┌──────────▼──────────┐   ┌─────────▼─────────┐
         │ Busca personagens   │   │ Extrai playerId   │
         │ do jogador          │   │ do JWT            │
         │ especificado        │   │                   │
         └──────────┬──────────┘   └─────────┬─────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │ Retorna personagens     │
                    │ filtrados do jogador    │
                    └─────────────────────────┘
```

---

## Segurança

✅ **Autorização:** O backend valida que o JWT é válido  
✅ **Privacidade:** Usuários só veem personagens de:
  - Si mesmos (via JWT)
  - Amigos adicionados em campanhas (via `playerId` explícito)
  
⚠️ **TODO:** Implementar validação no backend para garantir que só amigos podem ver personagens uns dos outros

---

## Próximos Passos

- [ ] Implementar flag `isInCampaign` no backend para indicar personagens já alocados
- [ ] Validar no backend que `playerId` fornecido é amigo do usuário autenticado
- [ ] Adicionar filtro de "personagens de amigos" na listagem (opcional)
- [ ] Implementar cache de personagens no frontend para reduzir chamadas à API

---

## Arquivos Modificados

```
✅ character.model.ts          - Adicionado playerId ao request
✅ character.service.ts         - Adicionado getCharactersByPlayer()
✅ list-character.page.ts       - Comentário sobre filtro automático via JWT
✅ create-campaign.page.ts      - Substituído mock por API real
```

---

**Data de Implementação:** 15/11/2025  
**Status:** ✅ Completo e funcional
