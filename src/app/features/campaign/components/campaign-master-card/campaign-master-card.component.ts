import { Component, input } from '@angular/core'
import { CampaignParticipant } from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-campaign-master-card',
  standalone: true,
  imports: [],
  templateUrl: './campaign-master-card.component.html',
  styleUrl: './campaign-master-card.component.scss',
})
export class CampaignMasterCardComponent {
  master = input.required<CampaignParticipant>()
}
