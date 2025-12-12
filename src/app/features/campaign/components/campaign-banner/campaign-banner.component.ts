import { Component, input, output, computed, inject } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { CampaignDetail } from '../../interfaces/campaign-detail.model'
import { UploadService } from '@shared/services/upload.service'

@Component({
  selector: 'aso-campaign-banner',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './campaign-banner.component.html',
  styleUrl: './campaign-banner.component.scss',
})
export class CampaignBannerComponent {
  private uploadService = inject(UploadService)

  campaign = input.required<CampaignDetail>()
  canEdit = input<boolean>(false)
  changeImage = output<void>()

  imageUrl = computed(() => {
    const image = this.campaign().image
    if (!image) return 'assets/d20.jpg'
    return this.uploadService.getImageUrl(image) || 'assets/d20.jpg'
  })

  onChangeImage(): void {
    this.changeImage.emit()
  }
}
