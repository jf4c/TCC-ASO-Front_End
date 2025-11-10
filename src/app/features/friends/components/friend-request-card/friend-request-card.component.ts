import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { FriendshipWithPlayer } from '../../interfaces/friendship.interface';

@Component({
  selector: 'aso-friend-request-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarComponent],
  templateUrl: './friend-request-card.component.html',
  styleUrl: './friend-request-card.component.scss',
})
export class FriendRequestCardComponent {
  @Input({ required: true }) request!: FriendshipWithPlayer;
  @Input() type: 'received' | 'sent' = 'received';
  
  @Output() accept = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();

  get player() {
    return this.type === 'received' ? this.request.requester : this.request.addressee;
  }

  onAccept(): void {
    this.accept.emit(this.request.id);
  }

  onReject(): void {
    this.reject.emit(this.request.id);
  }

  onCancel(): void {
    this.cancel.emit(this.request.id);
  }

  getFullName(): string {
    if (!this.player) return '';
    const { firstName, lastName } = this.player;
    return `${firstName} ${lastName}`.trim();
  }

  getTimeAgo(): string {
    const date = new Date(this.request.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `Há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
    }
  }
}
