import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FriendshipService } from '../../services/friendship.service';
import { PlayerSearchResultComponent } from '../../components/player-search-result/player-search-result.component';
import { PlayerSearchResult } from '../../interfaces/player-search.interface';

@Component({
  selector: 'aso-friend-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    InputText,
    ToastModule,
    PlayerSearchResultComponent
  ],
  providers: [MessageService],
  templateUrl: './friend-search.page.html',
  styleUrl: './friend-search.page.scss',
})
export class FriendSearchPage implements OnInit {
  private friendshipService = inject(FriendshipService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  searchTerm = '';
  results: PlayerSearchResult[] = [];
  loading = false;
  loadingPlayerId: string | null = null;
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    // Debounce na busca (500ms)
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        return this.friendshipService.searchPlayers(term);
      })
    ).subscribe({
      next: (results) => {
        this.results = results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar jogadores'
        });
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onAddFriend(playerId: string): void {
    this.loadingPlayerId = playerId;
    
    this.friendshipService.sendFriendRequest(playerId).subscribe({
      next: () => {
        this.loadingPlayerId = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Convite enviado com sucesso!'
        });
        
        // Atualiza resultado local
        const player = this.results.find(p => p.id === playerId);
        if (player) {
          player.hasPendingRequest = true;
        }
      },
      error: () => {
        this.loadingPlayerId = null;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao enviar convite'
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/amigos']);
  }
}
