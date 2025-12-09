import { Component, input, output, computed } from '@angular/core'
import { CampaignParticipant } from '../../interfaces/campaign-detail.model'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'aso-campaign-players-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-players-card.component.html',
  styleUrl: './campaign-players-card.component.scss',
})
export class CampaignPlayersCardComponent {
  players = input.required<CampaignParticipant[]>()
  maxPlayers = input.required<number>()
  isGameMaster = input<boolean>(false)
  playerSelected = output<CampaignParticipant>()
  addPlayer = output<void>()

  canAddPlayers = computed(() => {
    const isGM = this.isGameMaster();
    const currentPlayers = this.players().length;
    const max = this.maxPlayers();
    return isGM && currentPlayers < max;
  });

  onPlayerClick(player: CampaignParticipant): void {
    this.playerSelected.emit(player)
  }

  onAddPlayer(): void {
    this.addPlayer.emit()
  }
}
