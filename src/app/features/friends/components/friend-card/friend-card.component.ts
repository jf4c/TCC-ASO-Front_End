import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { Friend } from '../../interfaces/friend.interface';

@Component({
  selector: 'aso-friend-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarComponent],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.scss',
})
export class FriendCardComponent {
  @Input({ required: true }) friend!: Friend;
  @Input() showRemoveButton = true;
  
  @Output() remove = new EventEmitter<string>();
  @Output() viewProfile = new EventEmitter<string>();

  onRemove(): void {
    this.remove.emit(this.friend.friendshipId);
  }

  onViewProfile(): void {
    this.viewProfile.emit(this.friend.friend.id);
  }

  getFullName(): string {
    const { firstName, lastName } = this.friend.friend;
    return `${firstName} ${lastName}`.trim();
  }

  getFriendsSinceText(): string {
    if (!this.friend.friendsSince) {
      return 'Data não disponível';
    }

    try {
      const date = new Date(this.friend.friendsSince);
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Data inválida:', this.friend.friendsSince);
        return 'Data não disponível';
      }

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error);
      return 'Data não disponível';
    }
  }
}
