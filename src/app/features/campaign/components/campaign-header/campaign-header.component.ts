import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CampaignDetail } from '../../interfaces/campaign-detail.model'
import { UserRole } from '../../interfaces/campaign.model'
import { ButtonComponent } from '@shared/components/button/button.component'

@Component({
  selector: 'aso-campaign-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './campaign-header.component.html',
  styleUrl: './campaign-header.component.scss',
})
export class CampaignHeaderComponent {
  @Input({ required: true }) campaign!: CampaignDetail
  @Output() editCampaign = new EventEmitter<void>()
  @Output() invitePlayer = new EventEmitter<void>()
  @Output() leaveCampaign = new EventEmitter<void>()
  @Output() createCharacter = new EventEmitter<void>()

  readonly UserRole = UserRole

  onEditCampaign(): void {
    this.editCampaign.emit()
  }

  onInvitePlayer(): void {
    this.invitePlayer.emit()
  }

  onLeaveCampaign(): void {
    this.leaveCampaign.emit()
  }

  onCreateCharacter(): void {
    this.createCharacter.emit()
  }

  getStatusText(): string {
    switch (this.campaign.status) {
      case 'active':
        return 'Ativa'
      case 'paused':
        return 'Pausada'
      case 'finished':
        return 'Finalizada'
      default:
        return 'Desconhecido'
    }
  }

  getStatusClass(): string {
    switch (this.campaign.status) {
      case 'active':
        return 'status-active'
      case 'paused':
        return 'status-paused'
      case 'finished':
        return 'status-finished'
      default:
        return 'status-unknown'
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }
}
