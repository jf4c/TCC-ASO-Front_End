import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FriendshipService } from '../../services/friendship.service';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';
import { Friend } from '../../interfaces/friend.interface';

@Component({
  selector: 'aso-friends-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    InputText,
    ConfirmDialogModule,
    ToastModule,
    FriendCardComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './friends-list.page.html',
  styleUrl: './friends-list.page.scss',
})
export class FriendsListPage implements OnInit {
  private friendshipService = inject(FriendshipService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  friends: Friend[] = [];
  filteredFriends: Friend[] = [];
  searchTerm = '';
  loading = false;
  pendingCount = 0;

  ngOnInit(): void {
    this.loadFriends();
    this.loadCounts();

    // Subscrever para atualizações reativas
    this.friendshipService.friends$.subscribe(friends => {
      this.friends = friends;
      this.applyFilter();
    });

    this.friendshipService.counts$.subscribe(counts => {
      this.pendingCount = counts.pendingReceived;
    });
  }

  loadFriends(): void {
    this.loading = true;
    this.friendshipService.getFriends().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar amigos'
        });
      }
    });
  }

  loadCounts(): void {
    this.friendshipService.getCounts().subscribe();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredFriends = [...this.friends];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredFriends = this.friends.filter(friend =>
        friend.friend.nickName.toLowerCase().includes(term) ||
        friend.friend.firstName.toLowerCase().includes(term) ||
        friend.friend.lastName.toLowerCase().includes(term)
      );
    }
  }

  onRemoveFriend(friendshipId: string): void {
    const friend = this.friends.find(f => f.friendshipId === friendshipId);
    if (!friend) return;

    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover ${friend.friend.nickName} da sua lista de amigos?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, remover',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.friendshipService.removeFriendship(friendshipId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Amigo removido com sucesso'
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover amigo'
            });
          }
        });
      }
    });
  }

  goToSearch(): void {
    this.router.navigate(['/amigos/buscar']);
  }

  goToRequests(): void {
    this.router.navigate(['/amigos/convites']);
  }
}
