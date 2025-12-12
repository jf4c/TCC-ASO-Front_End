import { Component, input, output, computed, inject } from '@angular/core'
import { CampaignParticipant } from '../../interfaces/campaign-detail.model'
import { CommonModule } from '@angular/common'
import { UploadService } from '@shared/services/upload.service'

@Component({
  selector: 'aso-campaign-players-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-players-card.component.html',
  styleUrl: './campaign-players-card.component.scss',
})
export class CampaignPlayersCardComponent {
  private uploadService = inject(UploadService)

  players = input.required<CampaignParticipant[]>()
  maxPlayers = input.required<number>()
  isGameMaster = input<boolean>(false)
  playerSelected = output<CampaignParticipant>()
  addPlayer = output<void>()

  canAddPlayers = computed(() => {
    const isGM = this.isGameMaster();
    const currentPlayers = this.players().length;
    const max = this.maxPlayers();
    // maxPlayers do backend já inclui o mestre, então jogadores podem ser (max - 1)
    return isGM && currentPlayers < (max - 1);
  });

  getPlayerAvatar(player: CampaignParticipant): string {
    if (player.userAvatar) {
      return this.uploadService.getImageUrl(player.userAvatar) || 'assets/Character/unknown.png'
    }
    return 'assets/Character/unknown.png'
  }

  onPlayerClick(player: CampaignParticipant): void {
    this.playerSelected.emit(player)
  }

  onAddPlayer(): void {
    this.addPlayer.emit()
  }
}
