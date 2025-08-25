import { Component, input } from '@angular/core'
import { CampaignDetail } from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-campaign-banner',
  standalone: true,
  imports: [],
  templateUrl: './campaign-banner.component.html',
  styleUrl: './campaign-banner.component.scss',
})
export class CampaignBannerComponent {
  campaign = input.required<CampaignDetail>()
}
