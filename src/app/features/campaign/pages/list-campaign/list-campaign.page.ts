import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { CampaignService } from '../../services/campaign.service'
import { CampaignCardComponent } from '../../components/campaign-card/campaign-card.component'
import {
  Campaign,
  UserRole,
  CampaignStatus,
  GetCampaignsRequest,
} from '../../interfaces/campaign.model'
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

  campaigns: Campaign[] = []
  isLoading = false
  totalCampaigns = 0

  readonly UserRole = UserRole
  readonly CampaignStatus = CampaignStatus

  // Opções para dropdowns
  roleOptions = [
    { id: 'master', name: 'Mestre', value: UserRole.MASTER },
    { id: 'player', name: 'Jogador', value: UserRole.PLAYER },
  ]

  statusOptions = [
    { id: 'active', name: 'Ativa', value: CampaignStatus.ACTIVE },
    { id: 'paused', name: 'Pausada', value: CampaignStatus.PAUSED },
    { id: 'finished', name: 'Finalizada', value: CampaignStatus.FINISHED },
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
    const request: GetCampaignsRequest = {
      role: formValues.role || undefined,
      status: formValues.status || undefined,
      search: formValues.search || undefined,
    }

    const subscription = this.campaignService.getCampaigns(request).subscribe({
      next: (response) => {
        this.campaigns = response.campaigns
        this.totalCampaigns = response.totalCount
        this.isLoading = false
      },
      error: (error) => {
        console.error('Erro ao carregar campanhas:', error)
        this.isLoading = false
      },
    })

    this.subscriptions.add(subscription)
  }

  onViewCampaign(campaign: Campaign): void {
    console.log('Visualizar campanha:', campaign)
    // TODO: Implementar navegação para detalhes da campanha
    // this.router.navigate(['/campanhas', campaign.id])
  }

  onEditCampaign(campaign: Campaign): void {
    if (campaign.userRole === UserRole.MASTER) {
      console.log('Editar campanha:', campaign)
      // TODO: Implementar navegação para edição da campanha
      // this.router.navigate(['/campanhas', campaign.id, 'editar'])
    } else {
      console.log('Apenas o mestre pode editar esta campanha')
    }
  }

  onJoinCampaign(campaign: Campaign): void {
    if (campaign.userRole === UserRole.PLAYER) {
      console.log('Entrar na sessão da campanha:', campaign)
      // TODO: Implementar lógica para entrar na sessão
    } else {
      console.log('Iniciar sessão da campanha:', campaign)
      // TODO: Implementar lógica para iniciar sessão como mestre
    }
  }

  onCreateCampaign(): void {
    console.log('Criar nova campanha')
    // Futura navegação para criação
  }
}
