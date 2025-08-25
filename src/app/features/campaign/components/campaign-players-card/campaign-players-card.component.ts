import { Component, input } from '@angular/core'
import { CampaignParticipant } from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-campaign-players-card',
  standalone: true,
  imports: [],
  templateUrl: './campaign-players-card.component.html',
  styleUrl: './campaign-players-card.component.scss',
})
export class CampaignPlayersCardComponent {
  players = input.required<CampaignParticipant[]>()
}
