import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TabViewModule } from 'primeng/tabview'
import { ToastModule } from 'primeng/toast'
import { ConfirmationService, MessageService } from 'primeng/api'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import {
  CampaignDetail,
  UserRole,
  CharacterInCampaign,
  CampaignParticipant,
  ParticipantStatus,
  CharacterStatus
} from '../../interfaces/campaign-detail.model'
import { CampaignService } from '../../services/campaign.service'
import { CharacterService } from '../../../character/services/character.service'
import { ParticipantRole } from '../../interfaces/campaign-participant.interface'
import { AuthService } from '../../../../core/auth/auth.service'
import { CampaignBannerComponent } from '../../components/campaign-banner/campaign-banner.component'
import { CampaignSidebarComponent } from '../../components/campaign-sidebar/campaign-sidebar.component'
import { CharacterDetailDialogComponent } from '../../../character/components/dialogs/character-detail-dialog/character-detail-dialog.component'
import { PlayerInfoDialogComponent } from '../../components/player-info-dialog/player-info-dialog.component'
import { CampaignJournalComponent } from '../../components/campaign-journal/campaign-journal.component'
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component'
import { CharacterSelectionDialogComponent } from '../../components/dialogs/character-selection-dialog/character-selection-dialog.component'

@Component({
  selector: 'aso-view-campaign',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    TabViewModule,
    ToastModule,
    CampaignBannerComponent,
    CampaignSidebarComponent,
    CampaignJournalComponent,
    ImageUploadComponent,
  ],
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './view-campaign.page.html',
  styleUrl: './view-campaign.page.scss',
})
export class ViewCampaignPage implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private campaignService = inject(CampaignService)
  private characterService = inject(CharacterService)
  private authService = inject(AuthService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)
  private dialogService = inject(DialogService)

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
  isGameMaster = signal(false)

  // Computed property para campaignId
  campaignId = computed(() => {
    const campaign = this.campaign()
    return campaign?.id || this.route.snapshot.paramMap.get('id') || ''
  })

  // Computed properties para melhor performance
  master = computed(() => {
    const campaign = this.campaign()
    if (!campaign) return null

    // O Game Master é o participante cujo userId é igual ao masterId da campanha
    const masterId = (campaign as any).masterId
    const gameMaster = campaign.participants.find(
      (p) => p.userId === masterId
    )
    
    return gameMaster || null
  })

  players = computed(() => {
    const campaign = this.campaign()
    if (!campaign) return []

    // Filtra participantes que NÃO são o master
    const masterId = (campaign as any).masterId
    const players = campaign.participants.filter(
      (p) => p.userId !== masterId
    )
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
        
        // Buscar se é master via endpoint
        this.checkIfMaster(campaignId)
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da campanha:', err)
        this.error.set('Erro ao carregar detalhes da campanha')
        this.isLoading.set(false)
      },
    })
  }

  private checkIfMaster(campaignId: string): void {
    this.campaignService.isMaster(campaignId).subscribe({
      next: (response) => {
        this.isGameMaster.set(response.isMaster);
      },
      error: (err) => {
        console.error('Erro ao verificar se é master:', err);
        this.isGameMaster.set(false);
      }
    });
  }

  onDeleteCampaign(): void {
    if (!this.isGameMaster()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Acesso Negado',
        detail: 'Apenas o Game Master pode deletar esta campanha'
      })
      return
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const campaignId = this.campaign()?.id
        if (!campaignId) return

        this.campaignService.deleteCampaign(campaignId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Campanha excluída com sucesso'
            })
            setTimeout(() => {
              this.router.navigate(['/campanhas'])
            }, 1500)
          },
          error: (err) => {
            console.error('Erro ao deletar campanha:', err)
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível deletar a campanha'
            })
          }
        })
      }
    })
  }

  onInvitePlayer(): void {
    // TODO: Implementar modal de convite
  }

  onLeaveCampaign(): void {
    // TODO: Implementar confirmação e lógica de saída
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

  onCharacterSelected(character: CharacterInCampaign): void {
    // Buscar dados completos do personagem
    this.characterService.getCharacterById(character.id).subscribe({
      next: (fullCharacter) => {
        const ref = this.dialogService.open(CharacterDetailDialogComponent, {
          header: fullCharacter.name,
          width: '70vw',
          modal: true,
          contentStyle: { 'overflow': 'visible', 'padding': '1.5rem' },
          data: {
            character: fullCharacter,
            showSelectButton: false
          },
          breakpoints: {
            '960px': '85vw',
            '640px': '95vw',
          },
        });

        // Força scroll para o topo quando o dialog abre
        setTimeout(() => {
          const dialogContent = document.querySelector('.p-dialog-content');
          if (dialogContent) {
            dialogContent.scrollTop = 0;
          }
        }, 100);
      },
      error: (error) => {
        console.error('Erro ao carregar personagem:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados do personagem'
        });
      }
    });
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

  /**
   * Abre o diálogo com informações do jogador
   */
  onOpenPlayerInfo(participant: CampaignParticipant): void {
    const ref = this.dialogService.open(PlayerInfoDialogComponent, {
      header: 'Informações do Jogador',
      width: '600px',
      modal: true,
      data: {
        participant,
        campaignId: this.campaignId(),
        isGameMaster: this.isGameMaster()
      }
    });

    ref.onClose.subscribe((result: any) => {
      if (result?.characterAssigned) {
        this.loadCampaignDetail();
      } else if (result?.action === 'selectCharacter') {
        this.openCharacterSelection(result.characters, result.participant);
      } else if (result?.action === 'playerRemoved') {
        setTimeout(() => {
          this.loadCampaignDetail();
        }, 300);
      }
    });
  }

  /**
   * Abre dialog para adicionar novo jogador à campanha
   */
  onAddPlayer(): void {
    // TODO: Recriar dialog de adicionar player
    this.messageService.add({
      severity: 'info',
      summary: 'Em desenvolvimento',
      detail: 'Funcionalidade em desenvolvimento'
    });
  }

  private openCharacterSelection(characters: any[], participant: CampaignParticipant): void {
    const ref = this.dialogService.open(CharacterSelectionDialogComponent, {
      header: 'Selecionar Personagem',
      width: '900px',
      modal: true,
      data: {
        characters,
        participant
      }
    });

    ref.onClose.subscribe((result: any) => {
      if (result?.characterId) {
        this.assignCharacter(result.participant.userId, result.characterId);
      }
    });
  }

  private assignCharacter(userId: string, characterId: string): void {
    this.campaignService.assignCharacterToParticipant(
      this.campaignId(),
      userId,
      characterId
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Personagem atribuído com sucesso!'
        });
        this.loadCampaignDetail();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível atribuir o personagem'
        });
      }
    });
  }
}
