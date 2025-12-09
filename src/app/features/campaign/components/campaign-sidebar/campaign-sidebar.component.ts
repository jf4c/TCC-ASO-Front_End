import { Component, input, output } from '@angular/core'
import {
  CampaignParticipant,
  CharacterInCampaign,
} from '../../interfaces/campaign-detail.model'
import { CampaignMasterCardComponent } from '../campaign-master-card/campaign-master-card.component'
import { CampaignPlayersCardComponent } from '../campaign-players-card/campaign-players-card.component'
import { CampaignCharactersCardComponent } from '../campaign-characters-card/campaign-characters-card.component'

@Component({
  selector: 'aso-campaign-sidebar',
  standalone: true,
  imports: [
    CampaignMasterCardComponent,
    CampaignPlayersCardComponent,
    CampaignCharactersCardComponent,
  ],
  templateUrl: './campaign-sidebar.component.html',
  styleUrl: './campaign-sidebar.component.scss',
})
export class CampaignSidebarComponent {
  master = input<CampaignParticipant | null>(null)
  players = input.required<CampaignParticipant[]>()
  maxPlayers = input.required<number>()
  isGameMaster = input<boolean>(false)
  characterSelected = output<CharacterInCampaign>()
  playerSelected = output<CampaignParticipant>()
  addPlayer = output<void>()

  onCharacterSelected(character: CharacterInCampaign): void {
    this.characterSelected.emit(character)
  }

  onPlayerSelected(player: CampaignParticipant): void {
    this.playerSelected.emit(player)
  }

  onAddPlayer(): void {
    this.addPlayer.emit()
  }
}
