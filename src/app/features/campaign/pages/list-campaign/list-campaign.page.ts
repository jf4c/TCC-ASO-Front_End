import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

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
  isLoading = false
  totalCampaigns = 0

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
        this.loadCampaigns()
      })

    this.subscriptions.add(subscription)
  }

  loadCampaigns(): void {
    this.isLoading = true

    const formValues = this.filterForm.value
    const params: { status?: CampaignStatus; role?: 'creator' | 'gameMaster' | 'player' } = {}
    
    if (formValues.status) {
      params.status = formValues.status
    }
    if (formValues.role) {
      params.role = formValues.role
    }

    const subscription = this.campaignService.getCampaigns(params).subscribe({
      next: (campaigns: CampaignListItem[]) => {
        this.campaigns = campaigns
        this.totalCampaigns = campaigns.length
        this.isLoading = false
      },
      error: (error: Error) => {
        console.error('Erro ao carregar campanhas:', error)
        this.isLoading = false
      },
    })

    this.subscriptions.add(subscription)
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
      console.log('Apenas o criador ou mestre pode editar esta campanha')
      // TODO: Mostrar mensagem de erro para o usuário
    }
  }

  onJoinCampaign(campaign: CampaignListItem): void {
    if (campaign.myRole === 'player') {
      console.log('Entrar na sessão da campanha:', campaign)
      // TODO: Implementar lógica para entrar na sessão
    } else {
      console.log('Iniciar sessão da campanha:', campaign)
      // TODO: Implementar lógica para iniciar sessão como mestre
    }
  }

  onCreateCampaign(): void {
    this.router.navigate(['/campanhas/criar'])
  }
}
