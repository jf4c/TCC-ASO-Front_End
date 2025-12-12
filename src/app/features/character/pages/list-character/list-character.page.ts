import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PaginatorModule, PaginatorState } from 'primeng/paginator'
import { Toast } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import {
  Character,
  GetPaginatedCharacterResponse,
} from '@characters/interface/character.model'
import { AncestryService } from '@characters/services/ancestry.service'
import { ClassService } from '@characters/services/class.service'
import { CharacterService } from '@characters/services/character.service'
import { CharacterCardComponent } from '@characters/components/character-card/character-card.component'
import { InputComponent } from '@shared/components/input/input.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { ButtonComponent } from '@shared/components/button/button.component'
import { CardComponent } from '@shared/components/card/card.component'
import { FilterFormFactoryService } from '../../services/filter-form-factory.service'

@Component({
  selector: 'aso-list-character',
  standalone: true,
  imports: [
    CharacterCardComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
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
  private readonly characterService = inject(CharacterService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly messageService = inject(MessageService)
  private readonly filterFormFactoryService = inject(FilterFormFactoryService)
  private subscriptions = new Subscription()

  ancestries$ = this.ancestryService.getAncestries$()
  classes$ = this.classService.getClasses$()
  isLoading$ = this.ancestryService.getLoading$()

  charactersPerPage = 6
  currentPage = 0
  totalRecords = 0
  paginatedCharacters: Character[] = []
  first = 0
  pageSize = 3
  isLoadingCharacters = false

  protected readonly filterForm =
    this.filterFormFactoryService.createFilterForm()

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
    this.subscribeToFilterChanges()
  }

  private subscribeToFilterChanges(): void {
    const subscription = this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0
        this.first = 0
        this.loadCharacters()
      })

    this.subscriptions.add(subscription)
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage = event.page || 0
    this.first = event.first || 0
    this.pageSize = event.rows || 6
    this.loadCharacters()
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
    this.isLoadingCharacters = true

    const formValues = this.filterForm.value
    const request = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      // playerId não é passado aqui - o backend usa o JWT automaticamente
      name: formValues.name || undefined,
      ancestryName: formValues.ancestry?.name || undefined,
      className: formValues.class?.name || undefined,
    }

    const subscription = this.characterService
      .getPaginatedCharacter(request)
      .subscribe({
        next: (response: GetPaginatedCharacterResponse) => {
          console.log('🔍 RETORNO DA API - Lista de Personagens:', response);
          console.log('🔍 Primeiro personagem completo:', response.results[0]);
          this.paginatedCharacters = response.results
          this.totalRecords = response.rowCount
          this.isLoadingCharacters = false
        },
        error: (error) => {
          console.error('Erro ao carregar personagens:', error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar personagens',
          })
          this.isLoadingCharacters = false
        },
      })

    this.subscriptions.add(subscription)
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}
