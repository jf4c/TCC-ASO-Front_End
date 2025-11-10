import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FriendshipService } from '../../services/friendship.service';
import { FriendRequestCardComponent } from '../../components/friend-request-card/friend-request-card.component';
import { FriendshipWithPlayer } from '../../interfaces/friendship.interface';

@Component({
  selector: 'aso-friend-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TabViewModule,
    ToastModule,
    FriendRequestCardComponent
  ],
  providers: [MessageService],
  templateUrl: './friend-requests.page.html',
  styleUrl: './friend-requests.page.scss',
})
export class FriendRequestsPage implements OnInit {
  private friendshipService = inject(FriendshipService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  receivedRequests: FriendshipWithPlayer[] = [];
  sentRequests: FriendshipWithPlayer[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadRequests();

    // Subscrever para atualizações reativas
    this.friendshipService.pendingReceived$.subscribe(requests => {
      this.receivedRequests = requests;
    });

    this.friendshipService.pendingSent$.subscribe(requests => {
      this.sentRequests = requests;
    });
  }

  loadRequests(): void {
    this.loading = true;
    this.friendshipService.getReceivedRequests().subscribe();
    this.friendshipService.getSentRequests().subscribe({
      complete: () => {
        this.loading = false;
      }
    });
  }

  onAccept(friendshipId: string): void {
    this.friendshipService.acceptRequest(friendshipId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Convite aceito! Agora vocês são amigos.'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao aceitar convite'
        });
      }
    });
  }

  onReject(friendshipId: string): void {
    this.friendshipService.rejectRequest(friendshipId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Convite recusado',
          detail: 'O convite foi recusado'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao recusar convite'
        });
      }
    });
  }

  onCancel(friendshipId: string): void {
    this.friendshipService.removeFriendship(friendshipId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Convite cancelado',
          detail: 'O convite foi cancelado'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao cancelar convite'
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/amigos']);
  }
}
