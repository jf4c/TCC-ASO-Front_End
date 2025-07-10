import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { PaginatorModule, PaginatorState } from 'primeng/paginator'
import { Toast } from 'primeng/toast'
import { MessageService } from 'primeng/api'
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
    Toast,
  ],
  templateUrl: './list-character.page.html',
  styleUrl: './list-character.page.scss',
  providers: [MessageService],
})
export class ListCharacterPage implements OnInit, OnDestroy {
  private readonly ancestryService = inject(AncestryService)
  private readonly classService = inject(ClassService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly messageService = inject(MessageService)
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
    this.scrollToTop()
    this.initializeComponent()
    this.checkForSuccessMessage()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  private checkForSuccessMessage(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['success'] === 'character-created') {
        // Remove o query parameter da URL primeiro
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        })

        setTimeout(() => {
          this.showSuccess()
        }, 200)
      }
    })
  }

  private initializeComponent(): void {
    this.ancestryService.loadAncestries()
    this.classService.loadClasses()
    this.loadCharacters()
  }

  onEditCharacter(character: Character): void {
    this.showSuccess()
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

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Personagem Criado com sucesso!',
    })
  }

  private loadCharacters(): void {
    this.updatePaginatedCharacters()
  }

  private updatePaginatedCharacters(): void {
    const startIndex = this.currentPage * this.charactersPerPage
    const endIndex = startIndex + this.charactersPerPage
    this.paginatedCharacters = this.myCharacters.slice(startIndex, endIndex)
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}
