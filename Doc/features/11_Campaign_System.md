# Sistema de Campanhas - Plano de Ação

## 📋 Visão Geral

Sistema completo de gerenciamento de campanhas de RPG, permitindo criação, configuração de participantes (jogadores/mestres), seleção de personagens e controle de acesso.

---

## 🎯 Objetivos

1. **Criar campanhas** com nome e descrição
2. **Adicionar amigos** como participantes (baseado na lista de amigos)
3. **Definir papéis**: Mestre (GM) e Jogadores (Players)
4. **Selecionar personagens** de cada jogador para a campanha
5. **Gerenciar participantes**: adicionar, remover, trocar papéis
6. **Controlar acesso**: apenas criador e mestre podem editar configurações

---

## 🗄️ 1. BACKEND - Modelagem de Dados

### 1.1 Entidades Necessárias

#### `Campaign` (Campanha)
```csharp
public class Campaign
{
    public Guid Id { get; set; }
    public string Name { get; set; }              // Nome da campanha
    public string? Description { get; set; }      // Descrição (opcional)
    public Guid CreatorId { get; set; }           // Quem criou (Player)
    public Guid? GameMasterId { get; set; }       // Mestre atual (pode ser null inicialmente)
    public CampaignStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    
    // Navegação
    public Player Creator { get; set; }
    public Player? GameMaster { get; set; }
    public ICollection<CampaignParticipant> Participants { get; set; }
    
    // Configurações
    public int MaxPlayers { get; set; } = 6;      // Máximo de jogadores (padrão 6)
    public bool IsPublic { get; set; } = false;   // Campanha pública/privada
}

public enum CampaignStatus
{
    Planning = 0,      // Planejamento (criando)
    Active = 1,        // Ativa (em andamento)
    OnHold = 2,        // Pausada
    Completed = 3,     // Finalizada
    Cancelled = 4      // Cancelada
}
```

#### `CampaignParticipant` (Participante da Campanha)
```csharp
public class CampaignParticipant
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public Guid PlayerId { get; set; }
    public Guid? CharacterId { get; set; }        // Personagem selecionado (pode ser null)
    public ParticipantRole Role { get; set; }
    public DateTime JoinedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navegação
    public Campaign Campaign { get; set; }
    public Player Player { get; set; }
    public Character? Character { get; set; }
}

public enum ParticipantRole
{
    Player = 0,        // Jogador
    GameMaster = 1     // Mestre
}
```

#### Atualização em `Player`
```csharp
public class Player
{
    // ... campos existentes
    
    // Relacionamentos de campanha
    public ICollection<Campaign> CreatedCampaigns { get; set; }
    public ICollection<Campaign> MasteredCampaigns { get; set; }
    public ICollection<CampaignParticipant> CampaignParticipations { get; set; }
}
```

#### Atualização em `Character`
```csharp
public class Character
{
    // ... campos existentes
    
    // Relacionamentos de campanha
    public ICollection<CampaignParticipant> CampaignParticipations { get; set; }
}
```

### 1.2 Configuração EF Core
```csharp
// CampaignConfiguration.cs
public class CampaignConfiguration : IEntityTypeConfiguration<Campaign>
{
    public void Configure(EntityTypeBuilder<Campaign> builder)
    {
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(c => c.Description)
            .HasMaxLength(1000);
        
        builder.HasOne(c => c.Creator)
            .WithMany(p => p.CreatedCampaigns)
            .HasForeignKey(c => c.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(c => c.GameMaster)
            .WithMany(p => p.MasteredCampaigns)
            .HasForeignKey(c => c.GameMasterId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasIndex(c => c.CreatorId);
        builder.HasIndex(c => c.GameMasterId);
        builder.HasIndex(c => c.Status);
    }
}

// CampaignParticipantConfiguration.cs
public class CampaignParticipantConfiguration : IEntityTypeConfiguration<CampaignParticipant>
{
    public void Configure(EntityTypeBuilder<CampaignParticipant> builder)
    {
        builder.HasKey(cp => cp.Id);
        
        builder.HasOne(cp => cp.Campaign)
            .WithMany(c => c.Participants)
            .HasForeignKey(cp => cp.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne(cp => cp.Player)
            .WithMany(p => p.CampaignParticipations)
            .HasForeignKey(cp => cp.PlayerId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(cp => cp.Character)
            .WithMany(c => c.CampaignParticipations)
            .HasForeignKey(cp => cp.CharacterId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Índice único: um player só pode participar uma vez de cada campanha
        builder.HasIndex(cp => new { cp.CampaignId, cp.PlayerId })
            .IsUnique();
    }
}
```

---

## 🔌 2. BACKEND - Endpoints da API

### 2.1 Gerenciamento de Campanhas

#### `POST /api/Campaign`
**Descrição**: Cria nova campanha

**Request**:
```json
{
  "name": "A Maldição do Lich",
  "description": "Uma aventura épica contra forças obscuras...",
  "maxPlayers": 6,
  "isPublic": false
}
```

**Response**: `201 Created`
```json
{
  "id": "guid",
  "name": "A Maldição do Lich",
  "description": "Uma aventura épica...",
  "creatorId": "guid",
  "gameMasterId": null,
  "status": "Planning",
  "createdAt": "2024-01-01T10:00:00Z",
  "maxPlayers": 6,
  "isPublic": false,
  "participantsCount": 0
}
```

**Regras**:
- Criador automaticamente vira participante (mas não necessariamente GM)
- Status inicial: `Planning`
- `gameMasterId` pode ser null (criador define depois)

---

#### `GET /api/Campaign/{campaignId}`
**Descrição**: Busca campanha por ID com participantes

**Response**: `200 OK`
```json
{
  "id": "guid",
  "name": "A Maldição do Lich",
  "description": "Uma aventura épica...",
  "creator": {
    "id": "guid",
    "nickName": "jf4c",
    "firstName": "Julio",
    "lastName": "Costa"
  },
  "gameMaster": {
    "id": "guid",
    "nickName": "mestre_rpg",
    "firstName": "Carlos",
    "lastName": "Mestre"
  },
  "status": "Active",
  "createdAt": "2024-01-01T10:00:00Z",
  "startedAt": "2024-01-02T15:00:00Z",
  "maxPlayers": 6,
  "isPublic": false,
  "participants": [
    {
      "id": "guid",
      "player": {
        "id": "guid",
        "nickName": "mestre_rpg",
        "firstName": "Carlos",
        "lastName": "Mestre"
      },
      "character": null,
      "role": "GameMaster",
      "joinedAt": "2024-01-01T10:00:00Z"
    },
    {
      "id": "guid",
      "player": {
        "id": "guid",
        "nickName": "jogador01",
        "firstName": "João",
        "lastName": "Silva"
      },
      "character": {
        "id": "guid",
        "name": "Thorin Martelo de Ferro",
        "race": "Dwarf",
        "class": "Warrior"
      },
      "role": "Player",
      "joinedAt": "2024-01-01T11:00:00Z"
    }
  ],
  "canEdit": true,
  "canManageParticipants": true
}
```

**Permissões (incluir no response)**:
- `canEdit`: true se for criador ou GM
- `canManageParticipants`: true se for criador ou GM

---

#### `PUT /api/Campaign/{campaignId}`
**Descrição**: Atualiza informações da campanha

**Autorização**: Apenas criador ou GM

**Request**:
```json
{
  "name": "A Maldição do Lich - Atualizado",
  "description": "Nova descrição...",
  "maxPlayers": 8,
  "status": "Active"
}
```

**Response**: `200 OK`

---

#### `DELETE /api/Campaign/{campaignId}`
**Descrição**: Deleta campanha

**Autorização**: Apenas criador

**Response**: `204 No Content`

---

#### `GET /api/Campaign`
**Descrição**: Lista campanhas do usuário (criadas ou participando)

**Query Params**:
- `status` (opcional): filtrar por status
- `role` (opcional): `creator`, `gameMaster`, `player`

**Response**: `200 OK`
```json
[
  {
    "id": "guid",
    "name": "A Maldição do Lich",
    "description": "Uma aventura...",
    "status": "Active",
    "createdAt": "2024-01-01T10:00:00Z",
    "participantsCount": 5,
    "maxPlayers": 6,
    "myRole": "GameMaster",
    "isCreator": false
  }
]
```

---

### 2.2 Gerenciamento de Participantes

#### `POST /api/Campaign/{campaignId}/participants`
**Descrição**: Adiciona participante (amigo) à campanha

**Autorização**: Apenas criador ou GM

**Request**:
```json
{
  "playerId": "guid",
  "role": "Player"  // "Player" ou "GameMaster"
}
```

**Response**: `201 Created`
```json
{
  "id": "guid",
  "playerId": "guid",
  "role": "Player",
  "joinedAt": "2024-01-01T12:00:00Z"
}
```

**Validações**:
- ❌ Só pode adicionar amigos
- ❌ Limite de participantes (maxPlayers)
- ❌ Player já está na campanha
- ❌ Se role = GameMaster, apenas um GM por vez

---

#### `GET /api/Campaign/{campaignId}/available-friends`
**Descrição**: Lista amigos disponíveis para adicionar (não estão na campanha)

**Response**: `200 OK`
```json
[
  {
    "id": "guid",
    "nickName": "jogador02",
    "firstName": "Maria",
    "lastName": "Santos",
    "charactersCount": 3
  }
]
```

---

#### `PUT /api/Campaign/{campaignId}/participants/{participantId}/role`
**Descrição**: Altera papel do participante

**Autorização**: Apenas criador

**Request**:
```json
{
  "role": "GameMaster"
}
```

**Response**: `200 OK`

**Regras**:
- Se novo role = GameMaster:
  - Remove GM anterior (vira Player)
  - Atualiza `campaign.gameMasterId`
- Se novo role = Player:
  - Se era GM, atualiza `campaign.gameMasterId = null`

---

#### `PUT /api/Campaign/{campaignId}/participants/{participantId}/character`
**Descrição**: Define personagem do participante

**Autorização**: 
- Criador/GM pode definir para qualquer participante
- Jogador pode definir apenas para si mesmo

**Request**:
```json
{
  "characterId": "guid"  // ou null para remover
}
```

**Response**: `200 OK`

**Validações**:
- ❌ Personagem deve pertencer ao player do participante
- ❌ Personagem não pode estar em outra campanha ativa
- ❌ GM não precisa de personagem (role = GameMaster)

---

#### `GET /api/Campaign/{campaignId}/participants/{participantId}/available-characters`
**Descrição**: Lista personagens disponíveis do participante

**Response**: `200 OK`
```json
[
  {
    "id": "guid",
    "name": "Thorin Martelo de Ferro",
    "race": "Dwarf",
    "class": "Warrior",
    "level": 5,
    "isInCampaign": false
  }
]
```

---

#### `DELETE /api/Campaign/{campaignId}/participants/{participantId}`
**Descrição**: Remove participante da campanha

**Autorização**: 
- Criador/GM pode remover qualquer participante
- Jogador pode sair da campanha (remover a si mesmo)

**Response**: `204 No Content`

**Validações**:
- ❌ Não pode remover o criador
- ⚠️ Se remover GM, `campaign.gameMasterId = null`

---

#### `POST /api/Campaign/{campaignId}/set-game-master`
**Descrição**: Define o mestre da campanha (atalho)

**Autorização**: Apenas criador

**Request**:
```json
{
  "playerId": "guid"  // ou null para remover GM
}
```

**Response**: `200 OK`

**Regras**:
- Se player não está na campanha, adiciona automaticamente
- Atualiza role do participante para GameMaster
- Remove GM anterior (vira Player)

---

### 2.3 Status da Campanha

#### `POST /api/Campaign/{campaignId}/start`
**Descrição**: Inicia campanha (Planning → Active)

**Autorização**: Criador ou GM

**Validações**:
- ❌ Deve ter pelo menos 1 jogador (além do GM)
- ❌ Status deve ser Planning
- ✅ GM é opcional (pode iniciar sem)

**Response**: `200 OK`

---

#### `POST /api/Campaign/{campaignId}/pause`
**Descrição**: Pausa campanha (Active → OnHold)

**Response**: `200 OK`

---

#### `POST /api/Campaign/{campaignId}/resume`
**Descrição**: Retoma campanha (OnHold → Active)

**Response**: `200 OK`

---

#### `POST /api/Campaign/{campaignId}/complete`
**Descrição**: Finaliza campanha (Active → Completed)

**Response**: `200 OK`

---

## 🎨 3. FRONTEND - Estrutura de Arquivos

```
src/app/features/campaign/
├── pages/
│   ├── campaign-list/
│   │   ├── campaign-list.page.ts
│   │   ├── campaign-list.page.html
│   │   └── campaign-list.page.scss
│   ├── campaign-create/
│   │   ├── campaign-create.page.ts
│   │   ├── campaign-create.page.html
│   │   └── campaign-create.page.scss
│   ├── campaign-detail/
│   │   ├── campaign-detail.page.ts
│   │   ├── campaign-detail.page.html
│   │   └── campaign-detail.page.scss
│   └── campaign-edit/
│       ├── campaign-edit.page.ts
│       ├── campaign-edit.page.html
│       └── campaign-edit.page.scss
├── components/
│   ├── campaign-card/
│   │   ├── campaign-card.component.ts
│   │   ├── campaign-card.component.html
│   │   └── campaign-card.component.scss
│   ├── participant-card/
│   │   ├── participant-card.component.ts
│   │   ├── participant-card.component.html
│   │   └── participant-card.component.scss
│   ├── add-participant-dialog/
│   │   ├── add-participant-dialog.component.ts
│   │   ├── add-participant-dialog.component.html
│   │   └── add-participant-dialog.component.scss
│   └── select-character-dialog/
│       ├── select-character-dialog.component.ts
│       ├── select-character-dialog.component.html
│       └── select-character-dialog.component.scss
├── services/
│   └── campaign.service.ts
└── interfaces/
    ├── campaign.interface.ts
    ├── campaign-participant.interface.ts
    └── campaign-detail.interface.ts
```

---

## 📐 4. FRONTEND - Interfaces TypeScript

### 4.1 `campaign.interface.ts`
```typescript
export enum CampaignStatus {
  Planning = 0,
  Active = 1,
  OnHold = 2,
  Completed = 3,
  Cancelled = 4
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  gameMasterId?: string;
  status: CampaignStatus;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  maxPlayers: number;
  isPublic: boolean;
}

export interface CampaignListItem {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  createdAt: Date;
  participantsCount: number;
  maxPlayers: number;
  myRole: 'creator' | 'gameMaster' | 'player';
  isCreator: boolean;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  maxPlayers: number;
  isPublic: boolean;
}

export interface UpdateCampaignRequest {
  name: string;
  description?: string;
  maxPlayers: number;
  status: CampaignStatus;
}
```

### 4.2 `campaign-participant.interface.ts`
```typescript
export enum ParticipantRole {
  Player = 0,
  GameMaster = 1
}

export interface CampaignParticipant {
  id: string;
  playerId: string;
  characterId?: string;
  role: ParticipantRole;
  joinedAt: Date;
  isActive: boolean;
}

export interface ParticipantWithDetails {
  id: string;
  player: {
    id: string;
    nickName: string;
    firstName: string;
    lastName: string;
  };
  character?: {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
  };
  role: ParticipantRole;
  joinedAt: Date;
}

export interface AddParticipantRequest {
  playerId: string;
  role: ParticipantRole;
}

export interface AvailableFriend {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
  charactersCount: number;
}

export interface AvailableCharacter {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  isInCampaign: boolean;
}
```

### 4.3 `campaign-detail.interface.ts`
```typescript
export interface CampaignDetail {
  id: string;
  name: string;
  description?: string;
  creator: PlayerBasicInfo;
  gameMaster?: PlayerBasicInfo;
  status: CampaignStatus;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  maxPlayers: number;
  isPublic: boolean;
  participants: ParticipantWithDetails[];
  canEdit: boolean;
  canManageParticipants: boolean;
}

interface PlayerBasicInfo {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
}
```

---

## 🔧 5. FRONTEND - Service

### 5.1 `campaign.service.ts` (Estrutura)
```typescript
@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Campaign`;
  
  // Observables para estado reativo
  private campaignsSubject = new BehaviorSubject<CampaignListItem[]>([]);
  public campaigns$ = this.campaignsSubject.asObservable();
  
  private currentCampaignSubject = new BehaviorSubject<CampaignDetail | null>(null);
  public currentCampaign$ = this.currentCampaignSubject.asObservable();
  
  // CRUD Campanhas
  createCampaign(data: CreateCampaignRequest): Observable<Campaign>
  getCampaign(campaignId: string): Observable<CampaignDetail>
  updateCampaign(campaignId: string, data: UpdateCampaignRequest): Observable<Campaign>
  deleteCampaign(campaignId: string): Observable<void>
  getMyCampaigns(status?: CampaignStatus, role?: string): Observable<CampaignListItem[]>
  
  // Gerenciamento de Participantes
  addParticipant(campaignId: string, data: AddParticipantRequest): Observable<CampaignParticipant>
  getAvailableFriends(campaignId: string): Observable<AvailableFriend[]>
  updateParticipantRole(campaignId: string, participantId: string, role: ParticipantRole): Observable<void>
  updateParticipantCharacter(campaignId: string, participantId: string, characterId: string | null): Observable<void>
  getAvailableCharacters(campaignId: string, participantId: string): Observable<AvailableCharacter[]>
  removeParticipant(campaignId: string, participantId: string): Observable<void>
  setGameMaster(campaignId: string, playerId: string | null): Observable<void>
  
  // Controle de Status
  startCampaign(campaignId: string): Observable<void>
  pauseCampaign(campaignId: string): Observable<void>
  resumeCampaign(campaignId: string): Observable<void>
  completeCampaign(campaignId: string): Observable<void>
  
  // Helpers
  refreshCampaigns(): void
  refreshCurrentCampaign(campaignId: string): void
}
```

---

## 🧭 6. FRONTEND - Rotas

```typescript
{
  path: 'campanhas',
  children: [
    {
      path: '',
      component: CampaignListPage,
      title: 'Minhas Campanhas'
    },
    {
      path: 'criar',
      component: CampaignCreatePage,
      title: 'Criar Campanha'
    },
    {
      path: ':id',
      component: CampaignDetailPage,
      title: 'Detalhes da Campanha'
    },
    {
      path: ':id/editar',
      component: CampaignEditPage,
      title: 'Editar Campanha'
    }
  ],
  canActivate: [AuthGuard]
}
```

---

## 🖼️ 7. FRONTEND - Página de Criar Campanha

### 7.1 `campaign-create.page` - Layout e Funcionalidades

**Fluxo de Criação (Step by Step)**:

#### **PASSO 1: Informações Básicas**
```
┌─────────────────────────────────────────────┐
│ Criar Nova Campanha                         │
├─────────────────────────────────────────────┤
│                                             │
│ Nome da Campanha *                          │
│ [_________________________________]         │
│                                             │
│ Descrição                                   │
│ [_________________________________]         │
│ [_________________________________]         │
│ [_________________________________]         │
│                                             │
│ Máximo de Jogadores                         │
│ [▼ 6 jogadores]                            │
│                                             │
│ ☐ Campanha Pública                          │
│                                             │
│           [Cancelar]  [Próximo →]           │
└─────────────────────────────────────────────┘
```

#### **PASSO 2: Definir Mestre (Opcional)**
```
┌─────────────────────────────────────────────┐
│ Criar Nova Campanha                         │
│ [● Informações  ● Mestre  ○ Jogadores]      │
├─────────────────────────────────────────────┤
│ Quem será o Mestre da Mesa?                 │
│                                             │
│ ⦿ Eu serei o mestre                         │
│ ○ Escolher um amigo                         │
│ ○ Definir depois                            │
│                                             │
│ [Se "Escolher um amigo" selecionado:]       │
│                                             │
│ Selecione o Mestre:                         │
│ ┌─────────────────────────────────────────┐ │
│ │ ○ [Avatar] mestre_rpg                   │ │
│ │            Carlos Mestre                 │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ ○ [Avatar] jogador01                    │ │
│ │            João Silva                    │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│           [← Voltar]  [Próximo →]           │
└─────────────────────────────────────────────┘
```

#### **PASSO 3: Adicionar Jogadores**
```
┌─────────────────────────────────────────────┐
│ Criar Nova Campanha                         │
│ [● Informações  ● Mestre  ● Jogadores]      │
├─────────────────────────────────────────────┤
│ Adicionar Jogadores (0/6)                   │
│                                             │
│ 🔍 [Buscar amigos...]                       │
│                                             │
│ Amigos Disponíveis:                         │
│ ┌─────────────────────────────────────────┐ │
│ │ ☐ [Avatar] jogador01                    │ │
│ │            João Silva                    │ │
│ │            3 personagens                 │ │
│ │                         [Adicionar +]    │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ ☐ [Avatar] jogador02                    │ │
│ │            Maria Santos                  │ │
│ │            1 personagem                  │ │
│ │                         [Adicionar +]    │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Jogadores Adicionados:                      │
│ ┌─────────────────────────────────────────┐ │
│ │ [Avatar] jogador01                      │ │
│ │          João Silva                      │ │
│ │          Sem personagem                  │ │
│ │          [Escolher Personagem] [×]       │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│           [← Voltar]  [Criar Campanha]      │
└─────────────────────────────────────────────┘
```

### 7.2 Funcionalidades da Página

**Validações**:
- Nome é obrigatório (3-100 caracteres)
- Descrição opcional (máx 1000 caracteres)
- MaxPlayers: 2-12 jogadores
- Pode criar sem GM (definir depois)
- Pode criar sem jogadores (adicionar depois)

**Ações**:
1. **Adicionar Jogador**: 
   - Abre lista de amigos
   - Filtro de busca por nickname
   - Mostra quantos personagens cada amigo tem
   
2. **Escolher Personagem**:
   - Abre dialog com personagens do jogador
   - Mostra apenas personagens disponíveis (não em campanha ativa)
   - Permite deixar sem personagem (escolher depois)
   
3. **Remover Jogador**:
   - Botão [×] remove jogador da lista
   
4. **Criar Campanha**:
   - Envia requisição para backend
   - Redireciona para página de detalhes da campanha
   - Toast de sucesso

---

## 📊 8. Ordem de Implementação

### **FASE 1: Backend - Modelagem** (2 dias)
1. ✅ Criar entidades `Campaign` e `CampaignParticipant`
2. ✅ Configurar relacionamentos
3. ✅ Criar migrations
4. ✅ Atualizar entidades `Player` e `Character`

### **FASE 2: Backend - CRUD Campanhas** (2-3 dias)
1. ✅ `POST /api/Campaign` - Criar
2. ✅ `GET /api/Campaign/{id}` - Buscar por ID
3. ✅ `PUT /api/Campaign/{id}` - Atualizar
4. ✅ `DELETE /api/Campaign/{id}` - Deletar
5. ✅ `GET /api/Campaign` - Listar minhas campanhas

### **FASE 3: Backend - Participantes** (3 dias)
1. ✅ `POST /api/Campaign/{id}/participants` - Adicionar
2. ✅ `GET /api/Campaign/{id}/available-friends` - Listar amigos disponíveis
3. ✅ `PUT /api/Campaign/{id}/participants/{pid}/role` - Trocar papel
4. ✅ `PUT /api/Campaign/{id}/participants/{pid}/character` - Definir personagem
5. ✅ `GET /api/Campaign/{id}/participants/{pid}/available-characters` - Listar personagens
6. ✅ `DELETE /api/Campaign/{id}/participants/{pid}` - Remover
7. ✅ `POST /api/Campaign/{id}/set-game-master` - Definir GM

### **FASE 4: Backend - Controle de Status** (1 dia)
1. ✅ `POST /api/Campaign/{id}/start` - Iniciar
2. ✅ `POST /api/Campaign/{id}/pause` - Pausar
3. ✅ `POST /api/Campaign/{id}/resume` - Retomar
4. ✅ `POST /api/Campaign/{id}/complete` - Finalizar

### **FASE 5: Frontend - Interfaces e Service** (1 dia)
1. ⏳ Criar interfaces TypeScript
2. ⏳ Implementar `CampaignService`
3. ⏳ Configurar rotas

### **FASE 6: Frontend - Criar Campanha** (3-4 dias)
1. ⏳ Implementar `campaign-create.page`
2. ⏳ Step 1: Formulário de informações básicas
3. ⏳ Step 2: Seleção de mestre
4. ⏳ Step 3: Adicionar jogadores
5. ⏳ Implementar `add-participant-dialog`
6. ⏳ Implementar `select-character-dialog`
7. ⏳ Integrar com backend

### **FASE 7: Frontend - Listar e Visualizar** (2-3 dias)
1. ⏳ Implementar `campaign-list.page`
2. ⏳ Implementar `campaign-card.component`
3. ⏳ Implementar `campaign-detail.page`
4. ⏳ Implementar `participant-card.component`
5. ⏳ Controles de status (iniciar, pausar, etc)

### **FASE 8: Frontend - Editar Campanha** (2 dias)
1. ⏳ Implementar `campaign-edit.page`
2. ⏳ Gerenciar participantes (adicionar/remover)
3. ⏳ Trocar papéis (GM ↔ Player)
4. ⏳ Editar personagens dos jogadores

### **FASE 9: Testes e Refinamentos** (2 dias)
1. ⏳ Testes end-to-end do fluxo completo
2. ⏳ Validações e edge cases
3. ⏳ Ajustes de UX/UI
4. ⏳ Permissões e autorização

---

## ⚠️ Regras de Negócio Importantes

### Permissões
1. **Criador** pode:
   - Editar informações da campanha
   - Definir/trocar GM
   - Adicionar/remover participantes
   - Trocar papéis de participantes
   - Deletar campanha
   
2. **Game Master** pode:
   - Editar informações da campanha
   - Adicionar/remover participantes (exceto criador)
   - Definir personagens dos jogadores
   - Iniciar/pausar/retomar campanha
   
3. **Jogador** pode:
   - Ver informações da campanha
   - Definir próprio personagem
   - Sair da campanha

### Validações
1. **Limite de participantes**: Respeitar `maxPlayers`
2. **Personagens únicos**: Um personagem não pode estar em 2 campanhas ativas
3. **GM único**: Apenas 1 GM por campanha
4. **Criador fixo**: Criador não pode ser removido
5. **Amizade obrigatória**: Só pode adicionar amigos à campanha

### Status
- **Planning**: Pode adicionar/remover participantes livremente
- **Active**: Pode adicionar participantes, mas com confirmação
- **OnHold**: Pausa temporária, pode retomar
- **Completed**: Não pode mais editar
- **Cancelled**: Não pode mais editar

---

## 🚀 Próximos Passos (Após MVP)

1. **Chat da Campanha** (integrado)
2. **Sessões de Jogo** (agendamento)
3. **Inventário Compartilhado**
4. **Notas e Diário da Campanha**
5. **Mapa e Localizações**
6. **NPCs e Inimigos**
7. **Sistema de Loot/Recompensas**

---

**Documento criado em**: 10/11/2025  
**Versão**: 1.0  
**Status**: Planejamento - Pronto para iniciar implementação
