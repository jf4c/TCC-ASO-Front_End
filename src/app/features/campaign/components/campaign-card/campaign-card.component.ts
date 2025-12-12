import { Component, Input, Output, EventEmitter, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  CampaignListItem,
  CampaignStatus,
} from '../../interfaces/campaign.interface'
import { UploadService } from '@shared/services/upload.service'

@Component({
  selector: 'aso-campaign-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss',
})
export class CampaignCardComponent {
  private uploadService = inject(UploadService)

  @Input({ required: true }) campaign!: CampaignListItem
  @Output() view = new EventEmitter<CampaignListItem>()
  @Output() edit = new EventEmitter<CampaignListItem>()
  @Output() join = new EventEmitter<CampaignListItem>()

  readonly CampaignStatus = CampaignStatus

  getCampaignImage(): string {
    console.log('Campaign bannerImage field:', this.campaign.bannerImage);
    if (this.campaign.bannerImage) {
      const fullUrl = this.uploadService.getImageUrl(this.campaign.bannerImage);
      console.log('Full URL:', fullUrl);
      return fullUrl || 'assets/d20.jpg'
    }
    return 'assets/d20.jpg'
  }

  onViewCampaign(): void {
    this.view.emit(this.campaign)
  }

  onEditClick(event: Event): void {
    event.stopPropagation()
    this.edit.emit(this.campaign)
  }

  onJoinClick(event: Event): void {
    event.stopPropagation()
    this.join.emit(this.campaign)
  }

  getStatusText(): string {
    switch (this.campaign.status) {
      case CampaignStatus.Planning:
        return 'Planejamento'
      case CampaignStatus.Active:
        return 'Ativa'
      case CampaignStatus.OnHold:
        return 'Pausada'
      case CampaignStatus.Completed:
        return 'Finalizada'
      case CampaignStatus.Cancelled:
        return 'Cancelada'
      default:
        return 'Desconhecido'
    }
  }

  getRoleText(): string {
    switch (this.campaign.myRole) {
      case 'creator':
        return 'Criador'
      case 'gameMaster':
        return 'Mestre'
      case 'player':
        return 'Jogador'
      default:
        return 'Desconhecido'
    }
  }

  getStatusColor(): string {
    switch (this.campaign.status) {
      case CampaignStatus.Planning:
        return 'planning'
      case CampaignStatus.Active:
        return 'active'
      case CampaignStatus.OnHold:
        return 'paused'
      case CampaignStatus.Completed:
        return 'finished'
      case CampaignStatus.Cancelled:
        return 'cancelled'
      default:
        return 'finished'
    }
  }

  getRoleBadgeColor(): string {
    switch (this.campaign.myRole) {
      case 'creator':
      case 'gameMaster':
        return 'master'
      case 'player':
        return 'player'
      default:
        return 'player'
    }
  }
}
