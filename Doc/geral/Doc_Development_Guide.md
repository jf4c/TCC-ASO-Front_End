# Artificial Story Oracle - Guia de Desenvolvimento

## 📖 Introdução

Este guia fornece diretrizes e boas práticas para desenvolvimento no projeto Artificial Story Oracle. Siga estas convenções para manter consistência e qualidade no código.

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- **Node.js**: v18.x ou superior
- **npm**: v9.x ou superior
- **Angular CLI**: v19.x
- **Git**: Para controle de versão
- **VS Code**: Editor recomendado

### Extensões Recomendadas para VS Code
```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

### Configuração Inicial
```bash
# Clone do repositório
git clone [repository-url]
cd artificial-story-oracle

# Instalação de dependências
npm install

# Verificação da instalação
ng version
npm run lint
```

## 📝 Convenções de Código

### Nomenclatura

#### Arquivos e Diretórios
```
# Componentes
character-card.component.ts
character-list.page.ts

# Serviços
character.service.ts
character-validation.service.ts

# Interfaces
character.model.ts
api-response.interface.ts

# Diretórios
character/
  ├── components/
  ├── pages/
  ├── services/
  └── interfaces/
```

#### Variáveis e Funções
```typescript
// camelCase para variáveis e funções
const characterName = 'Aragorn';
const isCharacterValid = true;

function createCharacter(data: CharacterData): Character {
  return { ...data };
}

// PascalCase para classes e interfaces
interface Character {
  name: string;
  level: number;
}

class CharacterService {
  // Propriedades privadas com underscore
  private _characters: Character[] = [];
  
  // Métodos públicos
  public getCharacters(): Character[] {
    return this._characters;
  }
}
```

#### Constantes
```typescript
// SCREAMING_SNAKE_CASE para constantes
const MAX_CHARACTER_LEVEL = 20;
const DEFAULT_CHARACTER_ATTRIBUTES = {
  health: 100,
  mana: 50
};

// Enums
enum CharacterClass {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  ROGUE = 'rogue',
  PRIEST = 'priest'
}
```

### Estrutura de Componentes

#### Ordem dos Membros
```typescript
@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss'
})
export class CharacterCardComponent implements OnInit, OnDestroy {
  // 1. Inputs
  @Input() character!: Character;
  @Input() editable = false;
  
  // 2. Outputs
  @Output() edit = new EventEmitter<Character>();
  @Output() delete = new EventEmitter<Character>();
  
  // 3. ViewChild/ContentChild
  @ViewChild('editDialog') editDialog!: Dialog;
  
  // 4. Propriedades públicas
  isLoading = false;
  errorMessage = '';
  
  // 5. Propriedades privadas
  private destroy$ = new Subject<void>();
  
  // 6. Injeções de dependência
  private characterService = inject(CharacterService);
  private router = inject(Router);
  
  // 7. Lifecycle hooks
  ngOnInit(): void {
    this.loadCharacterDetails();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 8. Métodos públicos
  onEdit(): void {
    this.edit.emit(this.character);
  }
  
  onDelete(): void {
    this.delete.emit(this.character);
  }
  
  // 9. Métodos privados
  private loadCharacterDetails(): void {
    // implementação
  }
}
```

### Estrutura de Serviços

```typescript
@Injectable({ providedIn: 'root' })
export class CharacterService {
  // 1. Propriedades privadas
  private readonly baseUrl = '/api/characters';
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  
  // 2. Propriedades públicas (observables)
  public characters$ = this.charactersSubject.asObservable();
  
  // 3. Injeções de dependência
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  
  // 4. Métodos públicos
  getAll(): Observable<Character[]> {
    return this.http.get<Character[]>(this.baseUrl).pipe(
      tap(characters => this.charactersSubject.next(characters)),
      catchError(this.handleError('getAll', []))
    );
  }
  
  create(character: Partial<Character>): Observable<Character> {
    return this.http.post<Character>(this.baseUrl, character).pipe(
      tap(newCharacter => {
        const current = this.charactersSubject.value;
        this.charactersSubject.next([...current, newCharacter]);
      }),
      catchError(this.handleError('create'))
    );
  }
  
  // 5. Métodos privados
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      this.notificationService.showError(`Erro ao ${operation}`);
      return of(result as T);
    };
  }
}
```

## 🎨 Padrões de Template

### Estrutura HTML
```html
<!-- character-card.component.html -->
<div class="character-card" [class.loading]="isLoading">
  <!-- Header -->
  <div class="character-card__header">
    <h3 class="character-card__title">{{ character.name }}</h3>
    <div class="character-card__actions">
      <button 
        *ngIf="editable"
        type="button"
        class="btn btn--secondary"
        (click)="onEdit()">
        Editar
      </button>
    </div>
  </div>
  
  <!-- Content -->
  <div class="character-card__content">
    <div class="character-card__info">
      <span class="label">Classe:</span>
      <span class="value">{{ character.class }}</span>
    </div>
    
    <div class="character-card__info">
      <span class="label">Nível:</span>
      <span class="value">{{ character.level }}</span>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="character-card__footer" *ngIf="character.image">
    <img 
      [src]="character.image" 
      [alt]="character.name"
      class="character-card__image">
  </div>
</div>
```

### Padrões de CSS/SCSS
```scss
// character-card.component.scss
.character-card {
  // 1. Propriedades de layout
  display: flex;
  flex-direction: column;
  padding: 1rem;
  
  // 2. Propriedades visuais
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  // 3. Estados
  &.loading {
    opacity: 0.6;
    pointer-events: none;
  }
  
  // 4. Elementos filhos
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
  }
  
  &__actions {
    display: flex;
    gap: 0.5rem;
  }
  
  &__content {
    flex: 1;
  }
  
  &__info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    .label {
      font-weight: 500;
      color: var(--text-color-secondary);
    }
    
    .value {
      color: var(--text-color);
    }
  }
  
  &__footer {
    margin-top: 1rem;
    text-align: center;
  }
  
  &__image {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }
}

// 5. Responsividade
@media (max-width: 768px) {
  .character-card {
    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
}
```

## 🔄 Padrões de Estado

### Reactive Programming
```typescript
// Uso de Observables
export class CharacterListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  characters$ = this.characterService.characters$.pipe(
    takeUntil(this.destroy$),
    startWith([]),
    catchError(error => {
      console.error('Erro ao carregar personagens:', error);
      return of([]);
    })
  );
  
  ngOnInit(): void {
    this.characterService.loadCharacters().subscribe();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Formulários Reativos
```typescript
export class CharacterFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  characterForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    class: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    health: [100, [Validators.required, Validators.min(1)]],
    mana: [50, [Validators.required, Validators.min(0)]]
  });
  
  get nameControl() {
    return this.characterForm.get('name')!;
  }
  
  onSubmit(): void {
    if (this.characterForm.valid) {
      const character = this.characterForm.value as Partial<Character>;
      this.characterService.create(character).subscribe();
    } else {
      this.markAllFieldsAsTouched();
    }
  }
  
  private markAllFieldsAsTouched(): void {
    Object.keys(this.characterForm.controls).forEach(key => {
      this.characterForm.get(key)?.markAsTouched();
    });
  }
}
```

## ✅ Boas Práticas

### Performance
```typescript
// Use OnPush change detection
@Component({
  selector: 'app-character-card',
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Use trackBy em *ngFor
<div *ngFor="let character of characters; trackBy: trackByCharacterId">

trackByCharacterId(index: number, character: Character): number {
  return character.id;
}
```

### Error Handling
```typescript
// Service level
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    // Log do erro
    console.error(`${operation} failed:`, error);
    
    // Notificação ao usuário
    this.notificationService.showError(`Erro ao ${operation}`);
    
    // Retorna resultado seguro
    return of(result as T);
  };
}

// Component level
loadCharacters(): void {
  this.isLoading = true;
  this.characterService.getAll().pipe(
    finalize(() => this.isLoading = false)
  ).subscribe({
    next: characters => this.characters = characters,
    error: error => this.errorMessage = 'Erro ao carregar personagens'
  });
}
```

### Accessibility
```html
<!-- Labels adequados -->
<label for="character-name">Nome do Personagem</label>
<input id="character-name" type="text" [formControl]="nameControl">

<!-- ARIA attributes -->
<button 
  type="button"
  [attr.aria-label]="'Editar personagem ' + character.name"
  (click)="onEdit()">
  <i class="pi pi-edit" aria-hidden="true"></i>
</button>

<!-- Estados de loading -->
<div [attr.aria-busy]="isLoading" [attr.aria-live]="'polite'">
  <span *ngIf="isLoading">Carregando...</span>
</div>
```

## 🧪 Testes

### Unit Tests
```typescript
describe('CharacterService', () => {
  let service: CharacterService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should create character', () => {
    const mockCharacter: Character = {
      id: 1,
      name: 'Test Character',
      class: 'warrior',
      level: 1
    };
    
    service.create(mockCharacter).subscribe(character => {
      expect(character).toEqual(mockCharacter);
    });
    
    const req = httpMock.expectOne('/api/characters');
    expect(req.request.method).toBe('POST');
    req.flush(mockCharacter);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
});
```

### Component Tests
```typescript
describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    component.character = {
      id: 1,
      name: 'Test Character',
      class: 'warrior',
      level: 1
    };
    fixture.detectChanges();
  });
  
  it('should display character name', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.character-card__title').textContent)
      .toContain('Test Character');
  });
  
  it('should emit edit event', () => {
    spyOn(component.edit, 'emit');
    
    const editButton = fixture.nativeElement.querySelector('.btn--edit');
    editButton.click();
    
    expect(component.edit.emit).toHaveBeenCalledWith(component.character);
  });
});
```

## 🚀 Deploy e Build

### Build Commands
```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Análise do bundle
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/artificial-story-oracle/stats.json
```

### Configurações de Ambiente
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  keycloakUrl: 'http://localhost:8080',
  features: {
    aiGeneration: true,
    advancedFilters: false
  }
};
```

## 📚 Recursos Adicionais

### Documentação
- [Angular Official Docs](https://angular.io/docs)
- [PrimeNG Documentation](https://primeng.org/)
- [RxJS Documentation](https://rxjs.dev/)

### Ferramentas
- [Angular DevTools](https://angular.io/guide/devtools)
- [Augury](https://augury.rangle.io/)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

---

**Versão**: 1.0  
**Última Atualização**: 1º de Julho de 2025  
**Próxima Revisão**: Quinzenal
