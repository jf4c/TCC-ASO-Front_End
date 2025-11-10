import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { PlayerSearchResult } from '../../interfaces/player-search.interface';

@Component({
  selector: 'aso-player-search-result',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarComponent],
  templateUrl: './player-search-result.component.html',
  styleUrl: './player-search-result.component.scss',
})
export class PlayerSearchResultComponent {
  @Input({ required: true }) player!: PlayerSearchResult;
  @Input() loading = false;
  
  @Output() addFriend = new EventEmitter<string>();

  onAddFriend(): void {
    if (!this.player.isFriend && !this.player.hasPendingRequest) {
      this.addFriend.emit(this.player.id);
    }
  }

  getFullName(): string {
    const { firstName, lastName } = this.player;
    return `${firstName} ${lastName}`.trim();
  }

  getButtonLabel(): string {
    if (this.player.isFriend) {
      return '✓ Já é seu amigo';
    } else if (this.player.hasPendingRequest) {
      return 'Convite Enviado ⏳';
    }
    return 'Adicionar Amigo';
  }

  getButtonIcon(): string {
    if (this.player.isFriend) {
      return 'pi pi-check';
    } else if (this.player.hasPendingRequest) {
      return 'pi pi-clock';
    }
    return 'pi pi-user-plus';
  }

  isButtonDisabled(): boolean {
    return this.player.isFriend || this.player.hasPendingRequest || this.loading;
  }
}
