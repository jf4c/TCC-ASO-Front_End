import { Component, input, output } from '@angular/core'
import {
  CampaignParticipant,
  CharacterInCampaign,
} from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-campaign-characters-card',
  standalone: true,
  imports: [],
  templateUrl: './campaign-characters-card.component.html',
  styleUrl: './campaign-characters-card.component.scss',
})
export class CampaignCharactersCardComponent {
  players = input.required<CampaignParticipant[]>()
  characterClick = output<CharacterInCampaign>()

  onCharacterClick(character: CharacterInCampaign): void {
    this.characterClick.emit(character)
  }
}
