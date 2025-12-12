import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CampaignParticipant } from '../../interfaces/campaign-detail.model';
import { CampaignService } from '../../services/campaign.service';
import { CharacterService } from '../../../character/services/character.service';
import { MessageService } from 'primeng/api';
import { UploadService } from '@shared/services/upload.service';

@Component({
  selector: 'aso-player-info-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './player-info-dialog.component.html',
  styleUrl: './player-info-dialog.component.scss',
})
export class PlayerInfoDialogComponent implements OnInit {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private campaignService = inject(CampaignService);
  private characterService = inject(CharacterService);
  private messageService = inject(MessageService);
  private uploadService = inject(UploadService);

  participant: CampaignParticipant | null = null;
  campaignId = '';
  isGameMaster = false;
  loading = false;

  getPlayerAvatar(): string {
    if (this.participant?.userAvatar) {
      return this.uploadService.getImageUrl(this.participant.userAvatar) || 'assets/Character/unknown.png'
    }
    return 'assets/Character/unknown.png'
  }

  ngOnInit(): void {
    this.participant = this.config.data?.participant;
    this.campaignId = this.config.data?.campaignId;
    this.isGameMaster = this.config.data?.isGameMaster ?? false;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onChangeCharacter(): void {
    if (!this.participant) return;
    
    this.loading = true;
    this.characterService.getCharactersByPlayer(this.participant.userId)
      .subscribe({
        next: (characters) => {
          this.loading = false;
          
          if (!characters || characters.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'Sem Personagens',
              detail: 'Este jogador não possui personagens disponíveis'
            });
            return;
          }

          // Retornar para o componente pai para abrir o dialog de seleção
          this.dialogRef.close({ 
            action: 'selectCharacter', 
            characters, 
            participant: this.participant 
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar os personagens disponíveis'
          });
          this.loading = false;
        }
      });
  }

  onRemovePlayer(): void {
    if (!this.participant) return;

    this.loading = true;
    this.campaignService.removePlayer(this.campaignId, this.participant.userId)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Jogador removido da campanha com sucesso'
          });
          this.dialogRef.close({ action: 'playerRemoved' });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error?.message || 'Não foi possível remover o jogador da campanha'
          });
          this.loading = false;
        }
      });
  }
}
