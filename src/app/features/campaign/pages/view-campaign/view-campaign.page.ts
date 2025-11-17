import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import {
  CampaignDetail,
  UserRole,
  CharacterInCampaign,
  CampaignParticipant,
  ParticipantStatus,
  CharacterStatus
} from '../../interfaces/campaign-detail.model'
import { CampaignService } from '../../services/campaign.service'
import { ParticipantRole } from '../../interfaces/campaign-participant.interface'
import { CampaignBannerComponent } from '../../components/campaign-banner/campaign-banner.component'
import { CampaignSidebarComponent } from '../../components/campaign-sidebar/campaign-sidebar.component'
import { CharacterDetailDialogComponent } from '../../components/character-detail-dialog/character-detail-dialog.component'
import { CampaignJournalComponent } from '../../components/campaign-journal/campaign-journal.component'
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component'

@Component({
  selector: 'aso-view-campaign',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    CampaignBannerComponent,
    CampaignSidebarComponent,
    CharacterDetailDialogComponent,
    CampaignJournalComponent,
    ImageUploadComponent,
  ],
  templateUrl: './view-campaign.page.html',
  styleUrl: './view-campaign.page.scss',
})
export class ViewCampaignPage implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private campaignService = inject(CampaignService)

  campaign = signal<CampaignDetail | null>(null)
  isLoading = signal(true)
  error = signal<string | null>(null)
  selectedCharacter = signal<CharacterInCampaign | null>(null)
  isGeneratingStory = signal(false)
  storyError = signal<string | null>(null)
  isEditingStory = signal(false)
  editedStory = signal<string>('')
  isAIMode = signal(false)
  aiPromptDetails = signal<string>('')
  generatedStory = signal<string>('')
  showImageDialog = signal(false)
  isUpdatingImage = signal(false)

  // Computed property para campaignId
  campaignId = computed(() => {
    const campaign = this.campaign()
    return campaign?.id || this.route.snapshot.paramMap.get('id') || ''
  })

  // Computed properties para melhor performance
  master = computed(() => {
    const campaign = this.campaign()
    if (!campaign) return null

    // O Game Master é o participante cujo userId é igual ao creatorId da campanha
    const creatorId = (campaign as any).creatorId
    const gameMaster = campaign.participants.find(
      (p) => p.userId === creatorId
    )
    
    return gameMaster || null
  })

  players = computed(() => {
    const campaign = this.campaign()
    if (!campaign) return []

    // Filtra participantes que NÃO são o criador e possuem personagem
    const creatorId = (campaign as any).creatorId
    const players = campaign.participants.filter(
      (p) => p.userId !== creatorId && !!p.character
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

    this.campaignService.getCampaign(campaignId).subscribe({
      next: (campaign) => {
        this.campaign.set(campaign as any)
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

  onGenerateStory(): void {
    // Entrar no modo de geração com IA
    this.isAIMode.set(true)
    this.aiPromptDetails.set('')
    this.generatedStory.set('')
    this.storyError.set(null)
  }

  onGenerateWithAI(): void {
    const currentCampaign = this.campaign()
    if (!currentCampaign) return

    // Coletar IDs dos personagens dos jogadores
    const characterIds = this.players()
      .map((p) => p.character?.id)
      .filter((id): id is string => !!id)

    if (characterIds.length === 0) {
      this.storyError.set('Nenhum personagem disponível para gerar a história')
      return
    }

    this.isGeneratingStory.set(true)
    this.storyError.set(null)

    // Combinar descrição da campanha com detalhes adicionais
    const campaignDescription = currentCampaign.description || ''
    const additionalDetails = this.aiPromptDetails()
    const fullDescription = additionalDetails 
      ? `${campaignDescription}\n\nDetalhes adicionais: ${additionalDetails}`
      : campaignDescription

    this.campaignService
      .generateCampaignStory({
        characterIds,
        campaignName: currentCampaign.title,
        campaignDescription: fullDescription,
      })
      .subscribe({
        next: (response) => {
          this.generatedStory.set(response.story)
          this.isGeneratingStory.set(false)
        },
        error: (err) => {
          console.error('Erro ao gerar história:', err)
          this.storyError.set('Erro ao gerar história. Tente novamente.')
          this.isGeneratingStory.set(false)
        },
      })
  }

  onAcceptAIStory(): void {
    const story = this.generatedStory()
    const campaignId = this.campaign()?.id
    if (!story || !campaignId) return

    // Salvar a história gerada
    this.campaignService.updateCampaignStory(campaignId, story).subscribe({
      next: () => {
        this.campaign.update((camp) => {
          if (!camp) return camp
          return { ...camp, storyIntroduction: story }
        })
        this.isAIMode.set(false)
        this.generatedStory.set('')
        this.aiPromptDetails.set('')
        this.storyError.set(null)
      },
      error: (err) => {
        console.error('Erro ao salvar história:', err)
        this.storyError.set('Erro ao salvar história. Tente novamente.')
      }
    })
  }

  onDiscardAIStory(): void {
    this.isAIMode.set(false)
    this.generatedStory.set('')
    this.aiPromptDetails.set('')
    this.storyError.set(null)
  }

  onEditStory(): void {
    const currentStory = this.campaign()?.storyIntroduction || ''
    this.editedStory.set(currentStory)
    this.isEditingStory.set(true)
  }

  onSaveStory(): void {
    const story = this.editedStory().trim()
    if (!story) {
      this.storyError.set('A história não pode estar vazia')
      return
    }

    const campaignId = this.campaign()?.id
    if (!campaignId) return

    // Chamar API para persistir
    this.campaignService.updateCampaignStory(campaignId, story).subscribe({
      next: () => {
        // Atualizar localmente
        this.campaign.update((camp) => {
          if (!camp) return camp
          return { ...camp, storyIntroduction: story }
        })
        this.isEditingStory.set(false)
        this.storyError.set(null)
      },
      error: (err) => {
        console.error('Erro ao salvar história:', err)
        this.storyError.set('Erro ao salvar história. Tente novamente.')
      }
    })
  }

  onCancelEdit(): void {
    this.isEditingStory.set(false)
    this.editedStory.set('')
    this.storyError.set(null)
  }

  /**
   * Navega para a página do mundo da campanha
   */
  onViewWorld(): void {
    const worldId = this.campaign()?.worldId
    if (worldId) {
      this.router.navigate(['/mundos', worldId])
    }
  }

  /**
   * Abre dialog para trocar imagem
   */
  onChangeCampaignImage(): void {
    this.showImageDialog.set(true)
  }

  /**
   * Fecha dialog de imagem
   */
  onCloseImageDialog(): void {
    this.showImageDialog.set(false)
  }

  /**
   * Atualiza imagem da campanha
   */
  onCampaignImageUploaded(url: string): void {
    const id = this.campaignId()
    if (!id) return

    this.isUpdatingImage.set(true)
    this.campaignService.updateCampaignImage(id, url).subscribe({
      next: (updatedCampaign) => {
        this.campaign.set(updatedCampaign)
        this.showImageDialog.set(false)
        this.isUpdatingImage.set(false)
      },
      error: (error) => {
        console.error('Erro ao atualizar imagem:', error)
        this.isUpdatingImage.set(false)
        alert('Erro ao atualizar imagem. Tente novamente.')
      },
    })
  }

  /**
   * Remove imagem da campanha
   */
  onCampaignImageRemoved(): void {
    const id = this.campaignId()
    if (!id) return

    this.isUpdatingImage.set(true)
    this.campaignService.updateCampaignImage(id, null).subscribe({
      next: (updatedCampaign) => {
        this.campaign.set(updatedCampaign)
        this.isUpdatingImage.set(false)
      },
      error: (error) => {
        console.error('Erro ao remover imagem:', error)
        this.isUpdatingImage.set(false)
        alert('Erro ao remover imagem. Tente novamente.')
      },
    })
  }
}
