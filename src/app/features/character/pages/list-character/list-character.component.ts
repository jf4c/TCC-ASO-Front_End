import { Component, inject, OnInit } from '@angular/core'
import { CharacterCardComponent } from '@features/character/components/character-card/character-card.component'
import { Character } from '@features/character/interface/character.model'
import { CommonModule } from '@angular/common'
import { InputComponent } from '@shared/components/input/input.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { ButtonComponent } from '@app/shared/components/button/button.component'
import {
  Ancestries,
  Ancestry,
} from '@features/character/interface/ancestry.model'
import { Class, Classes } from '@features/character/interface/class.model'
import { AncestryService } from '@features/character/services/ancestry.service'
import { ClassService } from '@features/character/services/class.service'
import { PaginatorModule } from 'primeng/paginator'

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
  ],
  templateUrl: './list-character.component.html',
  styleUrl: './list-character.component.scss',
})
export class ListCharacterComponent implements OnInit {
  private ancestryService = inject(AncestryService)
  private classService = inject(ClassService)
  ancestries: Ancestry[] = []
  classes: Class[] = []
  isLoading = true
  selectedAncestry: string | null = null
  charactersPerPage = 6
  currentPage = 0
  paginatedCharacters: Character[] = []

  ngOnInit(): void {
    this.isLoading = true
    this.loadCharacters()
    this.getAllancestry()
    this.getAllClasses()
  }

  first = 0

  rows = 10

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

  private getAllancestry() {
    this.ancestryService.getAncestries().subscribe({
      next: (data: Ancestries) => {
        console.log('Ancestries loaded:', data.ancestries)
        this.ancestries = data.ancestries as Ancestry[]
        // this.isLoading = false
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar as raças:', error)
      },
    })
  }

  private getAllClasses() {
    this.classService.getClasses().subscribe({
      next: (data: Classes) => {
        console.log('Classes loaded:', data.classes)
        this.classes = data.classes as Class[]
        // this.isLoading = false
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar as classes:', error)
      },
    })
  }

  loadCharacters() {
    // aqui você carrega todos os personagens
    // exemplo fictício:
    this.updatePaginatedCharacters()
  }

  handleEdit(character: Character) {
    // faça algo com o personagem editado
    console.log('Editando personagem:', character)
  }

  handleDelete(character: Character) {
    console.log('Delete character:', character.name)
  }

  onPageChange(event: any) {
    this.currentPage = event.page
    this.updatePaginatedCharacters()
  }

  updatePaginatedCharacters() {
    const startIndex = this.currentPage * this.charactersPerPage
    const endIndex = startIndex + this.charactersPerPage
    this.paginatedCharacters = this.myCharacters.slice(startIndex, endIndex)
  }
}
