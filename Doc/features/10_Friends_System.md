# Sistema de Amigos - Plano de Ação

## 📋 Visão Geral

Sistema completo de gerenciamento de amizades entre jogadores, permitindo busca por nickname, envio de convites, aceitação/recusa de solicitações e listagem de amigos.

---

## 🎯 Objetivos

1. Permitir que jogadores busquem outros por **nickname**
2. Enviar **convites de amizade**
3. Receber **notificações** de convites pendentes
4. **Aceitar ou recusar** convites
5. Listar **amigos confirmados**
6. Remover amizades (opcional)

---

## 🗄️ 1. BACKEND - Modelagem de Dados

### 1.1 Entidades Necessárias

#### `Friendship` (Tabela de Relacionamento)
```csharp
public class Friendship
{
    public Guid Id { get; set; }
    public Guid RequesterId { get; set; }  // Quem enviou o convite
    public Guid AddresseeId { get; set; }  // Quem recebeu o convite
    public FriendshipStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    
    // Navegação
    public Player Requester { get; set; }
    public Player Addressee { get; set; }
}

public enum FriendshipStatus
{
    Pending = 0,    // Convite enviado, aguardando resposta
    Accepted = 1,   // Convite aceito, são amigos
    Rejected = 2,   // Convite recusado
    Blocked = 3     // Bloqueado (funcionalidade futura)
}
```

#### Atualização na Entidade `Player`
```csharp
public class Player
{
    // ... campos existentes (Id, NickName, FirstName, LastName, Email)
    
    // Relacionamentos de amizade
    public ICollection<Friendship> SentFriendRequests { get; set; }
    public ICollection<Friendship> ReceivedFriendRequests { get; set; }
}
```

### 1.2 Configuração EF Core
```csharp
// FriendshipConfiguration.cs
public class FriendshipConfiguration : IEntityTypeConfiguration<Friendship>
{
    public void Configure(EntityTypeBuilder<Friendship> builder)
    {
        builder.HasKey(f => f.Id);
        
        builder.HasOne(f => f.Requester)
            .WithMany(p => p.SentFriendRequests)
            .HasForeignKey(f => f.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(f => f.Addressee)
            .WithMany(p => p.ReceivedFriendRequests)
            .HasForeignKey(f => f.AddresseeId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasIndex(f => new { f.RequesterId, f.AddresseeId })
            .IsUnique(); // Previne convites duplicados
    }
}
```

---

## 🔌 2. BACKEND - Endpoints da API

### 2.1 Busca de Jogadores

#### `GET /api/Player/search?nickname={nickname}`
**Descrição**: Busca jogadores por nickname (case-insensitive, partial match)

**Response**:
```json
[
  {
    "id": "guid",
    "nickName": "player123",
    "firstName": "John",
    "lastName": "Doe",
    "isFriend": false,          // Se já é amigo
    "hasPendingRequest": false  // Se já tem convite pendente
  }
]
```

**Lógica**:
- Buscar por `NickName.Contains(nickname)`
- Excluir o próprio usuário dos resultados
- Verificar status de amizade para cada resultado
- Limitar a 20 resultados

---

### 2.2 Gerenciamento de Convites

#### `POST /api/Friendship/send`
**Descrição**: Envia convite de amizade

**Request**:
```json
{
  "addresseeId": "guid"  // ID do player que receberá o convite
}
```

**Response**: `201 Created`
```json
{
  "id": "guid",
  "requesterId": "guid",
  "addresseeId": "guid",
  "status": "Pending",
  "createdAt": "2024-01-01T10:00:00Z"
}
```

**Validações**:
- ❌ Não pode enviar convite para si mesmo
- ❌ Não pode enviar convite duplicado (já existe Pending)
- ❌ Não pode enviar se já são amigos (Accepted)
- ✅ Pode reenviar se anterior foi Rejected

---

#### `GET /api/Friendship/received`
**Descrição**: Lista convites recebidos (pendentes)

**Response**:
```json
[
  {
    "id": "guid",
    "requester": {
      "id": "guid",
      "nickName": "friend123",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "status": "Pending",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

**Lógica**:
- Buscar onde `AddresseeId == CurrentUserId` e `Status == Pending`
- Ordenar por `CreatedAt DESC`

---

#### `GET /api/Friendship/sent`
**Descrição**: Lista convites enviados (pendentes)

**Response**: Similar ao anterior, mas com `addressee` ao invés de `requester`

---

#### `POST /api/Friendship/{friendshipId}/accept`
**Descrição**: Aceita convite de amizade

**Response**: `200 OK`
```json
{
  "id": "guid",
  "status": "Accepted",
  "acceptedAt": "2024-01-01T11:00:00Z"
}
```

**Validações**:
- ❌ Só quem recebeu pode aceitar (`AddresseeId == CurrentUserId`)
- ❌ Só pode aceitar se `Status == Pending`

---

#### `POST /api/Friendship/{friendshipId}/reject`
**Descrição**: Rejeita convite de amizade

**Response**: `200 OK`

**Validações**: Similar ao accept

---

#### `DELETE /api/Friendship/{friendshipId}`
**Descrição**: Remove amizade (desfaz amizade aceita ou cancela convite pendente)

**Response**: `204 No Content`

**Validações**:
- ✅ Ambos os lados podem remover amizade aceita
- ✅ Requester pode cancelar convite pendente
- ✅ Addressee pode deletar convite rejeitado

---

### 2.3 Listagem de Amigos

#### `GET /api/Friendship/friends`
**Descrição**: Lista todos os amigos confirmados

**Response**:
```json
[
  {
    "friendshipId": "guid",
    "friend": {
      "id": "guid",
      "nickName": "bestfriend",
      "firstName": "Alice",
      "lastName": "Wonder"
    },
    "friendsSince": "2024-01-01T11:00:00Z"
  }
]
```

**Lógica**:
- Buscar onde `(RequesterId == CurrentUserId OR AddresseeId == CurrentUserId) AND Status == Accepted`
- Retornar o "outro lado" da amizade como `friend`
- Ordenar por `AcceptedAt DESC`

---

#### `GET /api/Friendship/count`
**Descrição**: Retorna contadores para badges

**Response**:
```json
{
  "totalFriends": 15,
  "pendingReceived": 3,  // Convites que você precisa responder
  "pendingSent": 2       // Convites que você enviou aguardando resposta
}
```

---

## 🎨 3. FRONTEND - Estrutura de Arquivos

### 3.1 Feature Module: `friends/`

```
src/app/features/friends/
├── pages/
│   ├── friends-list/
│   │   ├── friends-list.page.ts
│   │   ├── friends-list.page.html
│   │   └── friends-list.page.scss
│   ├── friend-search/
│   │   ├── friend-search.page.ts
│   │   ├── friend-search.page.html
│   │   └── friend-search.page.scss
│   └── friend-requests/
│       ├── friend-requests.page.ts
│       ├── friend-requests.page.html
│       └── friend-requests.page.scss
├── components/
│   ├── friend-card/
│   │   ├── friend-card.component.ts
│   │   ├── friend-card.component.html
│   │   └── friend-card.component.scss
│   ├── friend-request-card/
│   │   ├── friend-request-card.component.ts
│   │   ├── friend-request-card.component.html
│   │   └── friend-request-card.component.scss
│   └── player-search-result/
│       ├── player-search-result.component.ts
│       ├── player-search-result.component.html
│       └── player-search-result.component.scss
├── services/
│   └── friendship.service.ts
└── interfaces/
    ├── friendship.interface.ts
    ├── friend.interface.ts
    └── player-search.interface.ts
```

---

## 📐 4. FRONTEND - Interfaces TypeScript

### 4.1 `friendship.interface.ts`
```typescript
export enum FriendshipStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Blocked = 3
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface FriendshipWithPlayer {
  id: string;
  requester?: PlayerBasicInfo;  // Presente em convites recebidos
  addressee?: PlayerBasicInfo;  // Presente em convites enviados
  status: FriendshipStatus;
  createdAt: Date;
}

export interface FriendshipCount {
  totalFriends: number;
  pendingReceived: number;
  pendingSent: number;
}
```

### 4.2 `friend.interface.ts`
```typescript
export interface Friend {
  friendshipId: string;
  friend: PlayerBasicInfo;
  friendsSince: Date;
}

export interface PlayerBasicInfo {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
}
```

### 4.3 `player-search.interface.ts`
```typescript
export interface PlayerSearchResult {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
  isFriend: boolean;
  hasPendingRequest: boolean;
}
```

---

## 🔧 5. FRONTEND - Service

### 5.1 `friendship.service.ts` (Estrutura)
```typescript
@Injectable({ providedIn: 'root' })
export class FriendshipService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  // Observables para estado reativo
  private friendsSubject = new BehaviorSubject<Friend[]>([]);
  public friends$ = this.friendsSubject.asObservable();
  
  private pendingReceivedSubject = new BehaviorSubject<FriendshipWithPlayer[]>([]);
  public pendingReceived$ = this.pendingReceivedSubject.asObservable();
  
  private countsSubject = new BehaviorSubject<FriendshipCount | null>(null);
  public counts$ = this.countsSubject.asObservable();
  
  // Métodos principais
  searchPlayers(nickname: string): Observable<PlayerSearchResult[]>
  sendFriendRequest(addresseeId: string): Observable<Friendship>
  getReceivedRequests(): Observable<FriendshipWithPlayer[]>
  getSentRequests(): Observable<FriendshipWithPlayer[]>
  acceptRequest(friendshipId: string): Observable<Friendship>
  rejectRequest(friendshipId: string): Observable<void>
  getFriends(): Observable<Friend[]>
  removeFriendship(friendshipId: string): Observable<void>
  getCounts(): Observable<FriendshipCount>
  
  // Método para refresh geral
  refreshAll(): void
}
```

---

## 🧭 6. FRONTEND - Rotas

### 6.1 Adicionar em `app.routes.ts`
```typescript
{
  path: 'amigos',
  children: [
    {
      path: '',
      component: FriendsListPage,
      title: 'Meus Amigos'
    },
    {
      path: 'buscar',
      component: FriendSearchPage,
      title: 'Buscar Amigos'
    },
    {
      path: 'convites',
      component: FriendRequestsPage,
      title: 'Convites de Amizade'
    }
  ],
  canActivate: [AuthGuard]
}
```

### 6.2 Atualizar Header com Badge
```html
<li class="nav-item">
  <a routerLink="/amigos" routerLinkActive="active">
    Amigos
    <span *ngIf="pendingRequestsCount > 0" class="badge">
      {{ pendingRequestsCount }}
    </span>
  </a>
</li>
```

---

## 🖼️ 7. FRONTEND - Páginas

### 7.1 `friends-list.page` (Lista de Amigos)
**Funcionalidades**:
- Lista todos os amigos confirmados
- Botão "Buscar Novos Amigos"
- Botão "Ver Convites Pendentes" (com badge se houver)
- Campo de busca/filtro local
- Opção de remover amizade (com confirmação)

**Layout**:
```
┌─────────────────────────────────────┐
│ 🔍 [Buscar amigos...]      [+ Adicionar] │
├─────────────────────────────────────┤
│ 📥 Você tem 3 convites pendentes    │
│    [Ver Convites]                   │
├─────────────────────────────────────┤
│ Meus Amigos (15)                    │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] player123              │ │
│ │          John Doe               │ │
│ │          Amigos desde 01/01/24  │ │
│ │                     [🗑️ Remover] │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] friend456              │ │
│ │          Jane Smith             │ │
│ │          Amigos desde 15/02/24  │ │
│ │                     [🗑️ Remover] │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

### 7.2 `friend-search.page` (Busca de Jogadores)
**Funcionalidades**:
- Campo de busca por nickname
- Debounce de 500ms na busca
- Lista de resultados com indicação de status
- Botões dinâmicos por status:
  - "Adicionar" (se não for amigo e não tiver convite)
  - "Convite Enviado" (desabilitado)
  - "✓ Já é seu amigo" (desabilitado)

**Layout**:
```
┌─────────────────────────────────────┐
│ Buscar Jogadores                    │
├─────────────────────────────────────┤
│ 🔍 [Digite o nickname...]           │
├─────────────────────────────────────┤
│ Resultados (5)                      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] player999              │ │
│ │          Alice Wonder           │ │
│ │          [Adicionar Amigo ➕]    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] friend000              │ │
│ │          Bob Builder            │ │
│ │          [Convite Enviado ⏳]    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] bestie                 │ │
│ │          Charlie Day            │ │
│ │          [✓ Já é seu amigo]     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

### 7.3 `friend-requests.page` (Convites Pendentes)
**Funcionalidades**:
- Abas: "Recebidos" e "Enviados"
- Tab "Recebidos": Convites que você precisa responder
  - Botões: Aceitar / Recusar
- Tab "Enviados": Convites que você enviou aguardando resposta
  - Botão: Cancelar

**Layout (Tab Recebidos)**:
```
┌─────────────────────────────────────┐
│ Convites de Amizade                 │
├─────────────────────────────────────┤
│ [Recebidos (3)] [Enviados (2)]      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] newplayer              │ │
│ │          New Player             │ │
│ │          Há 2 horas             │ │
│ │   [✓ Aceitar] [✗ Recusar]       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Avatar] coolname               │ │
│ │          Cool Name              │ │
│ │          Há 1 dia               │ │
│ │   [✓ Aceitar] [✗ Recusar]       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔔 8. Sistema de Notificações

### 8.1 Badge no Header
**Implementação**:
- Subscrever em `friendshipService.counts$`
- Exibir badge com número de convites recebidos pendentes
- Atualizar em tempo real quando aceitar/recusar

### 8.2 Polling (Fase 1 - Simples)
**Estratégia Inicial**:
- Fazer polling de `getCounts()` a cada 30 segundos quando usuário estiver logado
- Implementar em `app.component.ts` ou serviço dedicado

### 8.3 SignalR (Fase 2 - Avançado) [FUTURO]
**Notificações em Tempo Real**:
- Backend envia notificação quando:
  - Recebe novo convite
  - Convite é aceito
  - Convite é recusado
- Frontend recebe e atualiza UI instantaneamente

---

## 📊 9. Ordem de Implementação

### **FASE 1: Backend - Foundation** (1-2 dias)
1. ✅ Criar entidade `Friendship`
2. ✅ Configurar relacionamento com `Player`
3. ✅ Criar migration do banco
4. ✅ Implementar Repository/Command/Query para Friendship

### **FASE 2: Backend - Endpoints Básicos** (2-3 dias)
1. ✅ `POST /api/Friendship/send` - Enviar convite
2. ✅ `GET /api/Friendship/received` - Listar recebidos
3. ✅ `POST /api/Friendship/{id}/accept` - Aceitar
4. ✅ `POST /api/Friendship/{id}/reject` - Recusar
5. ✅ `GET /api/Friendship/friends` - Listar amigos
6. ✅ Testes unitários dos endpoints

### **FASE 3: Backend - Busca e Contadores** (1 dia)
1. ✅ `GET /api/Player/search?nickname={nickname}` - Busca
2. ✅ `GET /api/Friendship/count` - Contadores
3. ✅ `DELETE /api/Friendship/{id}` - Remover amizade

### **FASE 4: Frontend - Interfaces e Service** (1 dia)
1. ✅ Criar interfaces TypeScript
2. ✅ Implementar `FriendshipService`
3. ✅ Testes do service

### **FASE 5: Frontend - Páginas e Componentes** (3-4 dias)
1. ✅ Criar estrutura de pastas `features/friends/`
2. ✅ Implementar `friend-card.component`
3. ✅ Implementar `friend-request-card.component`
4. ✅ Implementar `player-search-result.component`
5. ✅ Implementar `friends-list.page`
6. ✅ Implementar `friend-search.page`
7. ✅ Implementar `friend-requests.page`

### **FASE 6: Frontend - Rotas e Navegação** (1 dia)
1. ✅ Adicionar rotas em `app.routes.ts`
2. ✅ Atualizar header com link e badge
3. ✅ Testar navegação completa

### **FASE 7: Notificações e Polling** (1-2 dias)
1. ✅ Implementar polling de `getCounts()`
2. ✅ Integrar badge no header
3. ✅ Adicionar feedback visual (toasts)

### **FASE 8: Testes e Refinamentos** (2 dias)
1. ✅ Testes end-to-end do fluxo completo
2. ✅ Ajustes de UX/UI
3. ✅ Tratamento de edge cases
4. ✅ Validações adicionais

### **FASE 9 [FUTURO]: SignalR** (3-4 dias)
1. ⏳ Configurar SignalR no backend
2. ⏳ Criar hub de notificações
3. ⏳ Integrar no frontend
4. ⏳ Substituir polling por notificações em tempo real

---

## ⚠️ Considerações Importantes

### Validações Críticas
1. **Prevenir auto-amizade**: Não permitir enviar convite para si mesmo
2. **Prevenir duplicatas**: Índice único em `(RequesterId, AddresseeId)`
3. **Prevenir spam**: Limitar número de convites por dia (opcional)
4. **Autorização**: Verificar que usuário só acessa seus próprios dados

### Performance
1. **Paginação**: Implementar em `GET /friends` se lista for muito grande
2. **Cache**: Cachear `getCounts()` no frontend por 30s
3. **Debounce**: Na busca de nickname (500ms)
4. **Índices**: Criar índices em `RequesterId`, `AddresseeId`, `Status`

### UX/UI
1. **Loading states**: Skeleton loaders nas listas
2. **Empty states**: Mensagens quando não há amigos/convites
3. **Confirmações**: Dialog antes de remover amizade
4. **Toasts**: Feedback de sucesso/erro em todas as ações
5. **Disable buttons**: Prevenir cliques múltiplos

### Segurança
1. **Authorization**: Todos os endpoints devem validar JWT
2. **Rate limiting**: Limitar requisições de busca
3. **Sanitização**: Validar nickname na busca (evitar SQL injection)

---

## 🚀 Próximos Passos Imediatos

1. **Revisar este documento com a equipe**
2. **Criar tasks no board de projeto** (se houver)
3. **Começar pela FASE 1** (Backend - Foundation)
4. **Definir prioridades**: Implementar MVP primeiro (Fases 1-6)
5. **Agendar reviews**: Revisar código após cada fase

---

## 📝 Notas Finais

- Este sistema segue a **arquitetura modular** do projeto
- Mantém **separação de responsabilidades** (service/page/component)
- Usa **Reactive Programming** (BehaviorSubject, Observables)
- Preparado para **escalar** (SignalR futuro)
- **Testável** (injeção de dependência, interfaces bem definidas)

---

**Documento criado em**: 09/11/2025  
**Versão**: 1.0  
**Status**: Planejamento - Aguardando aprovação
