import { Component, input, inject } from '@angular/core'
import { CampaignParticipant } from '../../interfaces/campaign-detail.model'
import { UploadService } from '@shared/services/upload.service'

@Component({
  selector: 'aso-campaign-master-card',
  standalone: true,
  imports: [],
  templateUrl: './campaign-master-card.component.html',
  styleUrl: './campaign-master-card.component.scss',
})
export class CampaignMasterCardComponent {
  private uploadService = inject(UploadService)
  
  master = input.required<CampaignParticipant>()

  getMasterAvatar(): string {
    const avatar = this.master().userAvatar
    if (avatar) {
      return this.uploadService.getImageUrl(avatar) || 'assets/Character/unknown.png'
    }
    return 'assets/Character/unknown.png'
  }
}
