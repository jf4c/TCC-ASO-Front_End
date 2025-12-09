import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { PaginatorModule, PaginatorState } from 'primeng/paginator'

import { CampaignService } from '../../services/campaign.service'
import { CampaignCardComponent } from '../../components/campaign-card/campaign-card.component'
import {
  CampaignListItem,
  CampaignStatus
} from '../../interfaces/campaign.interface'
import { ButtonComponent } from '@shared/components/button/button.component'
import { InputComponent } from '@shared/components/input/input.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { CardComponent } from '@shared/components/card/card.component'

@Component({
  selector: 'aso-list-campaign',
  standalone: true,
  imports: [
    CommonModule,
    CampaignCardComponent,
    ButtonComponent,
    InputComponent,
    DropdownInputComponent,
    CardComponent,
    ReactiveFormsModule,
    PaginatorModule,
  ],
  templateUrl: './list-campaign.page.html',
  styleUrl: './list-campaign.page.scss',
})
export class ListCampaignPage implements OnInit, OnDestroy {
  private readonly campaignService = inject(CampaignService)
  private readonly router = inject(Router)
  private readonly formBuilder = inject(FormBuilder)
  private subscriptions = new Subscription()

  campaigns: CampaignListItem[] = []
  allCampaigns: CampaignListItem[] = []
  isLoading = false
  totalCampaigns = 0
  currentPage = 0
  first = 0
  pageSize = 6

  readonly CampaignStatus = CampaignStatus

  // Opções para dropdowns
  roleOptions = [
    { id: 'creator', name: 'Criador', value: 'creator' },
    { id: 'gameMaster', name: 'Mestre', value: 'gameMaster' },
    { id: 'player', name: 'Jogador', value: 'player' },
  ]

  statusOptions = [
    { id: 'planning', name: 'Planejamento', value: CampaignStatus.Planning },
    { id: 'active', name: 'Ativa', value: CampaignStatus.Active },
    { id: 'onHold', name: 'Pausada', value: CampaignStatus.OnHold },
    { id: 'completed', name: 'Finalizada', value: CampaignStatus.Completed },
  ]

  filterForm = this.formBuilder.group({
    search: [''],
    role: [null],
    status: [null],
  })

  ngOnInit(): void {
    this.loadCampaigns()
    this.subscribeToFilterChanges()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  private subscribeToFilterChanges(): void {
    const subscription = this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 0
        this.first = 0
        this.loadCampaigns()
      })

    this.subscriptions.add(subscription)
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage = event.page || 0
    this.first = event.first || 0
    this.pageSize = event.rows || 6
    this.updatePaginatedCampaigns()
  }

  loadCampaigns(): void {
    this.isLoading = true

    const formValues = this.filterForm.value
    const params: { status?: CampaignStatus; role?: 'creator' | 'gameMaster' | 'player' } = {}
    
    // Extrai apenas o valor, não o objeto inteiro
    if (formValues.status !== null && formValues.status !== undefined) {
      params.status = typeof formValues.status === 'object' ? (formValues.status as any).value : formValues.status
    }
    if (formValues.role) {
      params.role = typeof formValues.role === 'object' ? (formValues.role as any).value : formValues.role
    }

    const subscription = this.campaignService.getCampaigns(params).subscribe({
      next: (campaigns: CampaignListItem[]) => {
        // Aplica filtro de busca localmente
        let filteredCampaigns = campaigns
        const searchTerm = formValues.search?.toLowerCase().trim()
        
        if (searchTerm) {
          filteredCampaigns = campaigns.filter(campaign => 
            campaign.name.toLowerCase().includes(searchTerm) ||
            campaign.description?.toLowerCase().includes(searchTerm)
          )
        }
        
        this.allCampaigns = filteredCampaigns
        this.totalCampaigns = filteredCampaigns.length
        this.currentPage = 0
        this.first = 0
        this.updatePaginatedCampaigns()
        this.isLoading = false
      },
      error: (error) => {
        console.error('Erro ao carregar campanhas:', error)
        this.isLoading = false
      },
    })

    this.subscriptions.add(subscription)
  }

  private updatePaginatedCampaigns(): void {
    const startIndex = this.currentPage * this.pageSize
    const endIndex = startIndex + this.pageSize
    this.campaigns = this.allCampaigns.slice(startIndex, endIndex)
  }

  onViewCampaign(campaign: CampaignListItem): void {
    this.router.navigate(['/campanhas', campaign.id])
  }

  onEditCampaign(campaign: CampaignListItem): void {
    if (campaign.myRole === 'creator' || campaign.myRole === 'gameMaster') {
      // Por enquanto redireciona para a página de detalhes
      // TODO: Criar página específica de edição de campanha
      this.router.navigate(['/campanhas', campaign.id])
    } else {
      // TODO: Mostrar mensagem de erro para o usuário
    }
  }

  onJoinCampaign(campaign: CampaignListItem): void {
    if (campaign.myRole === 'player') {
      // TODO: Implementar lógica para entrar na sessão
    } else {
      // TODO: Implementar lógica para iniciar sessão como mestre
    }
  }

  onCreateCampaign(): void {
    this.router.navigate(['/campanhas/criar'])
  }
}
