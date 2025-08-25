import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  Campaign,
  CampaignStatus,
  UserRole,
} from '../../interfaces/campaign.model'

@Component({
  selector: 'aso-campaign-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss',
})
export class CampaignCardComponent {
  @Input({ required: true }) campaign!: Campaign
  @Output() view = new EventEmitter<Campaign>()
  @Output() edit = new EventEmitter<Campaign>()
  @Output() join = new EventEmitter<Campaign>()

  readonly CampaignStatus = CampaignStatus
  readonly UserRole = UserRole

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
      case CampaignStatus.ACTIVE:
        return 'Ativa'
      case CampaignStatus.PAUSED:
        return 'Pausada'
      case CampaignStatus.FINISHED:
        return 'Finalizada'
      default:
        return 'Desconhecido'
    }
  }

  getRoleText(): string {
    return this.campaign.userRole === UserRole.MASTER ? 'Mestre' : 'Jogador'
  }

  getStatusColor(): string {
    switch (this.campaign.status) {
      case CampaignStatus.ACTIVE:
        return 'active'
      case CampaignStatus.PAUSED:
        return 'paused'
      case CampaignStatus.FINISHED:
        return 'finished'
      default:
        return 'finished'
    }
  }

  getRoleBadgeColor(): string {
    return this.campaign.userRole === UserRole.MASTER ? 'master' : 'player'
  }
}
