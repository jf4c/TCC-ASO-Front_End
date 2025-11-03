# Artificial Story Oracle - Arquitetura

## 📖 Visão Geral

Este documento descreve a arquitetura técnica do projeto Artificial Story Oracle, uma aplicação Angular para criação e gerenciamento de histórias de RPG com integração de inteligência artificial.

## 🏗️ Arquitetura Geral

### Padrão Arquitetural
- **Arquitetura Modular por Funcionalidade (Feature-Based)**
- **Component-Based Architecture**
- **Reactive Programming com RxJS**
- **Injeção de Dependência nativa do Angular**

### Tecnologias Principais
- **Frontend**: Angular 19.2.0
- **Linguagem**: TypeScript 5.7.2
- **UI Library**: PrimeNG 19.1.3
- **Estilização**: SCSS + TailwindCSS
- **Build Tool**: Angular CLI 19.2.13

## 📁 Estrutura de Diretórios

```
src/
├── app/
│   ├── core/                    # Módulos centrais e singletons
│   │   └── layout/              # Layout principal da aplicação
│   │       ├── layout.component.ts
│   │       └── components/
│   │           └── header/      # Cabeçalho da aplicação
│   ├── features/                # Módulos de funcionalidades
│   │   ├── character/           # Módulo de personagens
│   │   │   ├── components/      # Componentes específicos
│   │   │   ├── pages/          # Páginas/Containers
│   │   │   ├── services/       # Serviços de negócio
│   │   │   └── interfaces/     # Modelos e tipos
│   │   ├── world/              # Módulo de mundos (planejado)
│   │   ├── campaign/           # Módulo de campanhas (planejado)
│   │   └── home/               # Módulo da página inicial
│   ├── shared/                 # Recursos compartilhados
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── services/           # Serviços globais
│   │   ├── interfaces/         # Tipos compartilhados
│   │   └── utils/              # Utilitários
│   └── theme/                  # Configurações de tema
├── assets/                     # Recursos estáticos
│   ├── images/
│   └── Character/              # Imagens de personagens
└── styles/                     # Estilos globais
    └── _variables.scss
```

## 🔧 Camadas da Aplicação

### 1. Camada de Apresentação (UI Layer)
**Responsabilidade**: Interface do usuário e interações

#### Components
- **Smart Components (Containers)**: Gerenciam estado e lógica de negócio
- **Dumb Components (Presentation)**: Apenas apresentação e eventos

#### Pages
- Componentes de nível superior que representam rotas
- Coordenam múltiplos componentes
- Gerenciam estado local da página

### 2. Camada de Serviços (Service Layer)
**Responsabilidade**: Lógica de negócio e comunicação com APIs

#### Tipos de Serviços
- **Data Services**: Comunicação com backend/APIs
- **Business Logic Services**: Regras de negócio
- **Utility Services**: Funcionalidades auxiliares

### 3. Camada de Dados (Data Layer)
**Responsabilidade**: Modelos e interfaces

#### Estrutura
- **Interfaces**: Definição de contratos
- **Models**: Implementações concretas
- **DTOs**: Objetos de transferência de dados

## 🎨 Padrões de Design

### Component Design Patterns

#### 1. Container/Presentation Pattern
```typescript
// Container (Smart Component)
@Component({
  selector: 'app-character-list',
  template: `
    <app-character-card 
      *ngFor="let character of characters"
      [character]="character"
      (edit)="onEdit($event)"
      (delete)="onDelete($event)">
    </app-character-card>
  `
})
export class CharacterListComponent {
  characters = inject(CharacterService).getAll();
  
  onEdit(character: Character) { /* lógica */ }
  onDelete(character: Character) { /* lógica */ }
}

// Presentation (Dumb Component)
@Component({
  selector: 'app-character-card',
  inputs: ['character'],
  outputs: ['edit', 'delete']
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Output() edit = new EventEmitter<Character>();
  @Output() delete = new EventEmitter<Character>();
}
```

#### 2. Service Injection Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class CharacterService {
  private http = inject(HttpClient);
  
  getAll(): Observable<Character[]> {
    return this.http.get<Character[]>('/api/characters');
  }
}
```

### State Management

#### Local State
- Component state para dados temporários
- Reactive Forms para formulários
- Signals para estado reativo (Angular 16+)

#### Global State
- Services com BehaviorSubject para estado compartilhado
- Estado imutável sempre que possível

## 🔄 Fluxo de Dados

### Unidirecional Data Flow
```
[User Action] → [Component] → [Service] → [API/Backend]
                     ↓
[UI Update] ← [Component] ← [Service] ← [Response]
```

### Event Flow
1. **User Interaction**: Usuário interage com UI
2. **Component Handler**: Componente captura evento
3. **Service Call**: Componente chama serviço apropriado
4. **Data Processing**: Serviço processa dados/chamada API
5. **State Update**: Estado é atualizado
6. **UI Refresh**: Interface é atualizada automaticamente

## 🛡️ Padrões de Segurança

### Authentication & Authorization
- **Keycloak Integration**: Sistema de autenticação centralizado
- **JWT Tokens**: Autenticação baseada em tokens
- **Route Guards**: Proteção de rotas sensíveis
- **Role-Based Access**: Controle baseado em papéis

### Data Validation
- **Frontend Validation**: Validação imediata na UI
- **Schema Validation**: Validação de tipos com TypeScript
- **Sanitization**: Limpeza de dados de entrada

## 🚀 Performance

### Otimizações Implementadas
- **OnPush Change Detection**: Componentes otimizados
- **Lazy Loading**: Carregamento sob demanda de módulos
- **Tree Shaking**: Eliminação de código não utilizado
- **Bundle Optimization**: Otimização do bundle de produção

### Estratégias Planejadas
- **Virtual Scrolling**: Para listas grandes
- **Memoization**: Cache de operações custosas
- **Code Splitting**: Divisão de código por features
- **Service Workers**: Cache e funcionalidade offline

## 🧪 Estratégia de Testes

### Tipos de Teste
- **Unit Tests**: Jasmine + Karma
- **Integration Tests**: TestBed do Angular
- **E2E Tests**: Cypress (planejado)

### Estrutura de Testes
```
src/
├── app/
│   ├── features/
│   │   └── character/
│   │       ├── character.service.spec.ts
│   │       └── components/
│   │           └── character-card.component.spec.ts
```

## 🔌 Integração com APIs

### HTTP Communication
- **HttpClient**: Cliente HTTP nativo do Angular
- **Interceptors**: Middleware para requisições
- **Error Handling**: Tratamento centralizado de erros
- **Loading States**: Estados de carregamento consistentes

### API Structure
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}
```

## 🎨 Sistema de Temas

### Theme Architecture
- **CSS Custom Properties**: Variáveis CSS para temas
- **SCSS Variables**: Pré-processamento de estilos
- **Dynamic Theme Switching**: Alternância dinâmica
- **PrimeNG Theme Integration**: Integração com temas do PrimeNG

### Theme Structure
```scss
// _variables.scss
:root {
  --primary-color: #007ad9;
  --surface-color: #ffffff;
  --text-color: #495057;
}

[data-theme="dark"] {
  --primary-color: #4dabf7;
  --surface-color: #1e1e1e;
  --text-color: #ffffff;
}
```

## 📱 Responsividade

### Breakpoints
```scss
$breakpoints: (
  mobile: 576px,
  tablet: 768px,
  desktop: 992px,
  large: 1200px
);
```

### Mobile-First Approach
- Design responsivo com foco em mobile
- Progressive Enhancement
- Touch-friendly interfaces

## 🔮 Arquitetura Futura

### Planejamentos
- **Micro-frontends**: Divisão em aplicações menores
- **PWA**: Progressive Web App capabilities
- **WebAssembly**: Para operações intensivas
- **GraphQL**: API mais eficiente
- **Real-time**: WebSockets para colaboração

### Escalabilidade
- **Module Federation**: Federação de módulos
- **Monorepo**: Estrutura de repositório único
- **Shared Libraries**: Bibliotecas compartilhadas

---

**Versão**: 1.0  
**Última Atualização**: 1º de Julho de 2025  
**Próxima Revisão**: Mensal
