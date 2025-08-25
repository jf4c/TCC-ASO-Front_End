import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  CampaignParticipant,
  UserRole,
  CharacterStatus,
} from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-participant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss',
})
export class ParticipantCardComponent implements OnInit {
  @Input({ required: true }) participant!: CampaignParticipant

  ngOnInit(): void {
    console.log('ParticipantCard received:', this.participant)
  }

  getRoleText(): string {
    switch (this.participant.role) {
      case UserRole.MASTER:
        return 'Mestre do Jogo'
      case UserRole.PLAYER:
        return 'Jogador'
      default:
        return 'Desconhecido'
    }
  }

  getCharacterStatusClass(status: CharacterStatus): string {
    return status
  }

  getStatusBadgeClass(status: CharacterStatus): string {
    return status
  }

  getStatusText(status: CharacterStatus): string {
    switch (status) {
      case CharacterStatus.APPROVED:
        return 'Aprovado'
      case CharacterStatus.PENDING:
        return 'Pendente'
      case CharacterStatus.REJECTED:
        return 'Rejeitado'
      default:
        return 'Desconhecido'
    }
  }
}
