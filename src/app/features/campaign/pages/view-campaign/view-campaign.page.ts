import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import {
  CampaignDetail,
  UserRole,
  CharacterInCampaign,
} from '../../interfaces/campaign-detail.model'
import { CampaignDetailService } from '../../services/campaign-detail.service'
import { CampaignBannerComponent } from '../../components/campaign-banner/campaign-banner.component'
import { CampaignSidebarComponent } from '../../components/campaign-sidebar/campaign-sidebar.component'
import { CharacterDetailDialogComponent } from '../../components/character-detail-dialog/character-detail-dialog.component'
import { CampaignWorldComponent } from '../../components/campaign-world/campaign-world.component'
import { CampaignJournalComponent } from '../../components/campaign-journal/campaign-journal.component'

@Component({
  selector: 'aso-view-campaign',
  standalone: true,
  imports: [
    CommonModule,
    CampaignBannerComponent,
    CampaignSidebarComponent,
    CharacterDetailDialogComponent,
    CampaignWorldComponent,
    CampaignJournalComponent,
  ],
  templateUrl: './view-campaign.page.html',
  styleUrl: './view-campaign.page.scss',
})
export class ViewCampaignPage implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private campaignDetailService = inject(CampaignDetailService)

  campaign = signal<CampaignDetail | null>(null)
  isLoading = signal(true)
  error = signal<string | null>(null)
  selectedCharacter = signal<CharacterInCampaign | null>(null)

  // Computed property para campaignId
  campaignId = computed(() => {
    const campaign = this.campaign()
    return campaign?.id || this.route.snapshot.paramMap.get('id') || ''
  })

  // Computed properties para melhor performance
  master = computed(() => {
    const campaign = this.campaign()
    if (!campaign) return null

    const master =
      campaign.participants.find((p) => p.role === UserRole.MASTER) || null
    console.log('Master computed:', master)
    return master
  })

  players = computed(() => {
    const campaign = this.campaign()
    if (!campaign) return []

    const players = campaign.participants.filter(
      (p) => p.role === UserRole.PLAYER,
    )
    console.log('Players computed:', players.length, players)
    return players
  })

  ngOnInit(): void {
    this.loadCampaignDetail()
  }

  private loadCampaignDetail(): void {
    const campaignId = this.route.snapshot.paramMap.get('id')
    if (!campaignId) {
      this.error.set('ID da campanha não encontrado')
      this.isLoading.set(false)
      return
    }

    this.campaignDetailService.getCampaignDetail(campaignId).subscribe({
      next: (campaign) => {
        this.campaign.set(campaign)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da campanha:', err)
        this.error.set('Erro ao carregar detalhes da campanha')
        this.isLoading.set(false)
      },
    })
  }

  onEditCampaign(): void {
    const campaignId = this.campaign()?.id
    if (campaignId) {
      // Por enquanto redireciona para a mesma página (view)
      // TODO: Criar página específica de edição
      console.log('Editar campanha:', campaignId)
    }
  }

  onInvitePlayer(): void {
    // TODO: Implementar modal de convite
    console.log('Convidar jogador')
  }

  onLeaveCampaign(): void {
    // TODO: Implementar confirmação e lógica de saída
    console.log('Sair da campanha')
  }

  onCreateCharacter(): void {
    const campaignId = this.campaign()?.id
    if (campaignId) {
      this.router.navigate(['/personagens/criar'], {
        queryParams: { campaignId },
      })
    }
  }

  onBackToList(): void {
    this.router.navigate(['/campanhas'])
  }

  openCharacterDialog(character: CharacterInCampaign): void {
    this.selectedCharacter.set(character)
  }

  closeCharacterDialog(): void {
    this.selectedCharacter.set(null)
  }

  onCharacterSelected(character: CharacterInCampaign): void {
    this.selectedCharacter.set(character)
  }

  onCloseDialog(): void {
    this.selectedCharacter.set(null)
  }
}
