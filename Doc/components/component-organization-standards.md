# Padrões de Organização de Componentes

## Visão Geral

Este documento define os padrões de organização interna para componentes Angular no projeto Artificial Story Oracle, incluindo estrutura de imports, ordem de propriedades, métodos e nomenclatura.

## Objetivos

- Garantir consistência na estrutura dos componentes
- Facilitar leitura e manutenção do código
- Padronizar nomenclatura e convenções
- Melhorar a experiência de desenvolvimento em equipe

## Estrutura de Imports

### 1. Angular Core
```typescript
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
```

### 2. Shared Components (ordem alfabética)
```typescript
import { ButtonComponent } from '@shared/components/button/button.component'
import { CardComponent } from '@shared/components/card/card.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { InputComponent } from '@shared/components/input/input.component'
import { SliderComponent } from '@shared/components/slider/slider.component'
import { TextareaComponent } from '@shared/components/textarea/textarea.component'
```

### 3. Feature Models e Services
```typescript
import { Ancestries, Ancestry } from '@features/character/interface/ancestry.model'
import { Class, Classes } from '@features/character/interface/class.model'
import { AncestryService } from '../../services/ancestry.service'
import { ClassService } from '../../services/class.service'
import { FormFactoryService } from '@features/character/services/form-factory.service'
```

### 4. Bibliotecas Externas (se houver)
```typescript
import { Observable } from 'rxjs'
```

## Estrutura da Classe

### 1. Dependency Injection
```typescript
export class CreateCharacterPage implements OnInit {
  private readonly ancestryService = inject(AncestryService)
  private readonly classService = inject(ClassService)
  private readonly router = inject(Router)
  private readonly formBuilder = inject(FormBuilder)
  private readonly formFactoryService = inject(FormFactoryService)
```

**Convenções:**
- Usar `readonly` para dependencies
- Ordem alfabética por nome da propriedade
- Usar `inject()` em vez de constructor injection

### 2. Public Properties (Estado da UI)
```typescript
  loading = true
  ancestries: Ancestry[] = []
  classes: Class[] = []
```

**Convenções:**
- Propriedades que controlam estado da UI
- Dados que são vinculados ao template
- Ordem por importância/uso

### 3. Protected/Private Properties
```typescript
  protected readonly characterForm = this.formFactoryService.createCharacterForm()
  
  private readonly loadingText = 'Carregando...'
```

**Convenções:**
- `protected` para propriedades usadas no template
- `private` para propriedades internas
- Usar `readonly` quando apropriado

### 4. Computed Properties (Getters)
```typescript
  get displayName(): string {
    return this.characterForm.get('name')?.value || '...'
  }
  
  get strengthControl(): number {
    const attribute = this.characterForm.get('attributes.strength')?.value || 0
    const mod = (attribute - 10) / 2
    return Math.trunc(mod)
  }
```

**Convenções:**
- Agrupar getters relacionados
- Prefixos consistentes: `display`, `placeholder`, `control`
- Retorno tipado explícito

### 5. Lifecycle Methods
```typescript
  ngOnInit(): void {
    this.initializeComponent()
  }
```

### 6. Public Event Handlers
```typescript
  onGenerateRandomCharacter(): void {
    this.formFactoryService.generateRandomCharacter(this.characterForm)
  }

  onGenerateRandomName(): void {
    this.characterForm.patchValue({
      name: this.generateRandomName(),
    })
  }

  onReturnToList(): void {
    this.router.navigate(['/personagens'])
  }
```

**Convenções:**
- Prefixo `on` para handlers de eventos
- Verbos descritivos
- Sem lógica complexa (delegar para métodos privados)

### 7. Private Methods
```typescript
  private initializeComponent(): void {
    this.loadData()
  }

  private loadData(): void {
    this.loadAncestries()
    this.loadClasses()
  }

  private loadAncestries(): void { }
  private loadClasses(): void { }
```

**Convenções:**
- Métodos de inicialização primeiro
- Métodos de carregamento de dados
- Métodos utilitários por último

### 8. Utility Methods
```typescript
  private generateRandomName(): string { }
  private getRandomItem<T>(items: T[]): T { }
  private calculateModifier(attribute: number): number { }
```

## Padrões de Nomenclatura

### Propriedades
```typescript
// ✅ Bom
loading = true
loadingText = 'Carregando...'
ancestries: Ancestry[] = []

// ❌ Evitar
carregando = 'Carregando...'
placeholderCampaign = this.carregando
isLoading = true // redundante com loading
```

### Getters
```typescript
// ✅ Display values
get displayName(): string { }
get displayAncestry(): string { }

// ✅ Placeholders
get ancestryPlaceholder(): string { }
get classPlaceholder(): string { }

// ✅ Form controls
get strengthControl(): number { }
get strengthModifier(): number { }
```

### Métodos de Evento
```typescript
// ✅ Prefixo 'on'
onGenerateRandomName(): void { }
onSubmitForm(): void { }
onCancel(): void { }

// ❌ Evitar
generateRandomName(): void { }
handleRandomCharacter(): void { }
returnToCharacterList(): void { }
```

### Métodos Privados
```typescript
// ✅ Verbos descritivos
private loadAncestries(): void { }
private generateRandomName(): string { }
private calculateModifier(): number { }

// ❌ Evitar
private getAllancestry(): void { }
private getRandom(): string { }
```

## Exemplo Completo

```typescript
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'

import { ButtonComponent } from '@shared/components/button/button.component'
import { CardComponent } from '@shared/components/card/card.component'

import { Ancestry } from '@features/character/interface/ancestry.model'
import { AncestryService } from '../../services/ancestry.service'

@Component({
  selector: 'aso-create-character',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CardComponent],
  templateUrl: './create-character.page.html',
  styleUrl: './create-character.page.scss',
})
export class CreateCharacterPage implements OnInit {
  private readonly ancestryService = inject(AncestryService)
  private readonly router = inject(Router)
  
  loading = true
  ancestries: Ancestry[] = []
  
  protected readonly characterForm = this.formBuilder.group({
    name: [''],
  })
  
  private readonly loadingText = 'Carregando...'

  get displayName(): string {
    return this.characterForm.get('name')?.value || '...'
  }
  
  get ancestryPlaceholder(): string {
    return this.loading ? this.loadingText : 'Selecione uma Raça'
  }

  ngOnInit(): void {
    this.initializeComponent()
  }

  onGenerateRandomName(): void {
    this.characterForm.patchValue({
      name: this.generateRandomName(),
    })
  }

  onReturnToList(): void {
    this.router.navigate(['/personagens'])
  }

  private initializeComponent(): void {
    this.loadAncestries()
  }

  private loadAncestries(): void {
    this.ancestryService.getAncestries().subscribe({
      next: (data) => {
        this.ancestries = data.ancestries
        this.loading = false
      },
      error: (error) => {
        console.error('Erro ao carregar ancestralidades:', error)
        this.loading = false
      },
    })
  }

  private generateRandomName(): string {
    const names = ['Aragorn', 'Legolas', 'Gimli']
    return this.getRandomItem(names)
  }

  private getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }
}
```

## Benefícios

- **Legibilidade**: Estrutura previsível facilita navegação
- **Manutenibilidade**: Padrões consistentes reduzem tempo de compreensão
- **Colaboração**: Time trabalha com convenções unificadas
- **Escalabilidade**: Novos componentes seguem estrutura estabelecida

## Aplicação

- **Componentes de Página**: Seguir estrutura completa
- **Componentes Shared**: Focar em propriedades e getters
- **Serviços**: Aplicar padrões de nomenclatura e organização de métodos

---

**Versão**: 1.0  
**Data**: 8 de Julho de 2025  
**Última Atualização**: 8 de Julho de 2025
