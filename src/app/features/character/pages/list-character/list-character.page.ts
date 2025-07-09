import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PaginatorModule, PaginatorState } from 'primeng/paginator'
import { Character } from '@characters/interface/character.model'
import { AncestryService } from '@characters/services/ancestry.service'
import { ClassService } from '@characters/services/class.service'
import { CharacterCardComponent } from '@characters/components/character-card/character-card.component'
import { InputComponent } from '@shared/components/input/input.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { ButtonComponent } from '@shared/components/button/button.component'
import { CardComponent } from '@shared/components/card/card.component'

@Component({
  selector: 'aso-list-character',
  standalone: true,
  imports: [
    CharacterCardComponent,
    CommonModule,
    InputComponent,
    DropdownInputComponent,
    ButtonComponent,
    PaginatorModule,
    CardComponent,
  ],
  templateUrl: './list-character.page.html',
  styleUrl: './list-character.page.scss',
})
export class ListCharacterPage implements OnInit, OnDestroy {
  private readonly ancestryService = inject(AncestryService)
  private readonly classService = inject(ClassService)
  private readonly router = inject(Router)
  private subscriptions = new Subscription()

  ancestries$ = this.ancestryService.getAncestries$()
  classes$ = this.classService.getClasses$()
  isLoading$ = this.ancestryService.getLoading$()

  selectedAncestry: string | null = null
  charactersPerPage = 6
  currentPage = 0
  paginatedCharacters: Character[] = []
  first = 0
  rows = 10

  // Mock Data
  myCharacters: Character[] = [
    {
      name: 'Artemis',
      class: 'Mage',
      ancestry: 'Elf',
      level: 5,
      health: 40,
      mana: 80,
      image: 'mage1.png',
    },
    {
      name: 'Ares',
      class: 'Warrior',
      ancestry: 'Human',
      level: 10,
      health: 100,
      mana: 0,
      image: 'warrior1.png',
    },
    {
      name: 'Athena',
      class: 'Rogue',
      ancestry: 'Halfling',
      level: 8,
      health: 60,
      mana: 40,
      image: 'rogue1.png',
    },
    {
      name: 'Hades',
      class: 'Priest',
      ancestry: 'Dwarf',
      level: 12,
      health: 80,
      mana: 120,
      image: 'priest1.png',
    },
    {
      name: 'Zeus',
      class: 'Paladin',
      ancestry: 'Half-Orc',
      level: 15,
      health: 100,
      mana: 50,
      image: 'warrior2.png',
    },
    {
      name: 'Hades',
      class: 'Priest',
      ancestry: 'Dwarf',
      level: 12,
      health: 80,
      mana: 120,
      image: 'priest1.png',
    },
    {
      name: 'Zeus',
      class: 'Paladin',
      ancestry: 'Half-Orc',
      level: 15,
      health: 100,
      mana: 50,
      image: 'warrior2.png',
    },
    {
      name: 'Hades',
      class: 'Priest',
      ancestry: 'Dwarf',
      level: 12,
      health: 80,
      mana: 120,
      image: 'priest1.png',
    },
    {
      name: 'Zeus',
      class: 'Paladin',
      ancestry: 'Half-Orc',
      level: 15,
      health: 100,
      mana: 50,
      image: 'warrior2.png',
    },
    {
      name: 'Hades',
      class: 'Priest',
      ancestry: 'Dwarf',
      level: 12,
      health: 80,
      mana: 120,
      image: 'priest1.png',
    },
    {
      name: 'Zeus',
      class: 'Paladin',
      ancestry: 'Half-Orc',
      level: 15,
      health: 100,
      mana: 50,
      image: 'warrior2.png',
    },
    {
      name: 'Hades',
      class: 'Priest',
      ancestry: 'Dwarf',
      level: 12,
      health: 80,
      mana: 120,
      image: 'priest1.png',
    },
    {
      name: 'Zeus',
      class: 'Paladin',
      ancestry: 'Half-Orc',
      level: 15,
      health: 100,
      mana: 50,
      image: 'warrior2.png',
    },
    {
      name: 'Hades',
      class: 'Priest',
      ancestry: 'Dwarf',
      level: 12,
      health: 80,
      mana: 120,
      image: 'priest1.png',
    },
    {
      name: 'Zeus',
      class: 'Paladin',
      ancestry: 'Half-Orc',
      level: 15,
      health: 100,
      mana: 50,
      image: 'warrior2.png',
    },
  ]

  ngOnInit(): void {
    this.initializeComponent()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  private initializeComponent(): void {
    this.ancestryService.loadAncestries()
    this.classService.loadClasses()
    this.loadCharacters()
  }

  onEditCharacter(character: Character): void {
    console.log('Editando personagem:', character)
  }

  onDeleteCharacter(character: Character): void {
    console.log('Delete character:', character.name)
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage = event.page || 0
    this.updatePaginatedCharacters()
  }

  onNavigateToCreate(): void {
    this.router.navigate(['/personagens/criar'])
  }

  private loadCharacters(): void {
    this.updatePaginatedCharacters()
  }

  private updatePaginatedCharacters(): void {
    const startIndex = this.currentPage * this.charactersPerPage
    const endIndex = startIndex + this.charactersPerPage
    this.paginatedCharacters = this.myCharacters.slice(startIndex, endIndex)
  }
}
