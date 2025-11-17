import { Component, input, output } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { CampaignDetail } from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-campaign-banner',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './campaign-banner.component.html',
  styleUrl: './campaign-banner.component.scss',
})
export class CampaignBannerComponent {
  campaign = input.required<CampaignDetail>()
  canEdit = input<boolean>(false)
  changeImage = output<void>()

  onChangeImage(): void {
    this.changeImage.emit()
  }
}
