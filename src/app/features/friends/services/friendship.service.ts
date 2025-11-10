import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { 
  Friendship, 
  FriendshipWithPlayer, 
  FriendshipCount 
} from '../interfaces/friendship.interface';
import { Friend } from '../interfaces/friend.interface';
import { PlayerSearchResult } from '../interfaces/player-search.interface';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Friendship`;
  
  // Observables para estado reativo
  private friendsSubject = new BehaviorSubject<Friend[]>([]);
  public friends$ = this.friendsSubject.asObservable();
  
  private pendingReceivedSubject = new BehaviorSubject<FriendshipWithPlayer[]>([]);
  public pendingReceived$ = this.pendingReceivedSubject.asObservable();
  
  private pendingSentSubject = new BehaviorSubject<FriendshipWithPlayer[]>([]);
  public pendingSent$ = this.pendingSentSubject.asObservable();
  
  private countsSubject = new BehaviorSubject<FriendshipCount>({
    totalFriends: 0,
    pendingReceived: 0,
    pendingSent: 0
  });
  public counts$ = this.countsSubject.asObservable();

  /**
   * Busca jogadores por nickname
   */
  searchPlayers(nickname: string): Observable<PlayerSearchResult[]> {
    if (!nickname || nickname.trim().length === 0) {
      return of([]);
    }

    const trimmedNickname = nickname.trim();
    
    // Validação básica: mínimo 3 caracteres
    if (trimmedNickname.length < 3) {
      console.warn('⚠️ Nickname precisa ter pelo menos 3 caracteres');
      return of([]);
    }

    console.log('🔍 Buscando jogadores:', trimmedNickname);

    return this.http.get<PlayerSearchResult[]>(`${this.apiUrl}/search`, {
      params: { searchTerm: trimmedNickname }
    }).pipe(
      tap(results => console.log('✅ Resultados da busca:', results)),
      catchError((error) => {
        console.error('❌ Erro na busca:', error);
        return of([]);
      })
    );
  }

  /**
   * Envia convite de amizade
   */
  sendFriendRequest(addresseeId: string): Observable<Friendship> {
    console.log('📤 Enviando convite para:', addresseeId);
    
    return this.http.post<Friendship>(`${this.apiUrl}/send`, { addresseeId }).pipe(
      tap(friendship => {
        console.log('✅ Convite enviado:', friendship);
        this.refreshCounts();
      }),
      catchError((error) => {
        console.error('❌ Erro ao enviar convite:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Lista convites recebidos (pendentes)
   */
  getReceivedRequests(): Observable<FriendshipWithPlayer[]> {
    return this.http.get<FriendshipWithPlayer[]>(`${this.apiUrl}/requests/received`).pipe(
      tap(requests => {
        console.log('📥 Convites recebidos:', requests);
        this.pendingReceivedSubject.next(requests);
      }),
      catchError(this.handleError('getReceivedRequests', []))
    );
  }

  /**
   * Lista convites enviados (pendentes)
   */
  getSentRequests(): Observable<FriendshipWithPlayer[]> {
    return this.http.get<FriendshipWithPlayer[]>(`${this.apiUrl}/requests/sent`).pipe(
      tap(requests => {
        console.log('📤 Convites enviados:', requests);
        this.pendingSentSubject.next(requests);
      }),
      catchError(this.handleError('getSentRequests', []))
    );
  }

  /**
   * Aceita convite de amizade
   */
  acceptRequest(friendshipId: string): Observable<Friendship> {
    console.log('✅ Aceitando convite:', friendshipId);
    
    return this.http.post<Friendship>(`${this.apiUrl}/${friendshipId}/accept`, {}).pipe(
      tap(friendship => {
        console.log('✅ Convite aceito:', friendship);
        this.refreshAll();
      }),
      catchError((error) => {
        console.error('❌ Erro ao aceitar convite:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Rejeita convite de amizade
   */
  rejectRequest(friendshipId: string): Observable<void> {
    console.log('❌ Rejeitando convite:', friendshipId);
    
    return this.http.post<void>(`${this.apiUrl}/${friendshipId}/reject`, {}).pipe(
      tap(() => {
        console.log('❌ Convite rejeitado');
        this.refreshAll();
      }),
      catchError((error) => {
        console.error('❌ Erro ao rejeitar convite:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Lista todos os amigos confirmados
   */
  getFriends(): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${this.apiUrl}/friends`).pipe(
      tap(friends => {
        console.log('👥 Amigos:', friends);
        this.friendsSubject.next(friends);
      }),
      catchError(this.handleError('getFriends', []))
    );
  }

  /**
   * Remove amizade ou cancela convite
   */
  removeFriendship(friendshipId: string): Observable<void> {
    console.log('🗑️ Removendo amizade:', friendshipId);
    
    return this.http.delete<void>(`${this.apiUrl}/${friendshipId}`).pipe(
      tap(() => {
        console.log('🗑️ Amizade removida');
        this.refreshAll();
      }),
      catchError((error) => {
        console.error('❌ Erro ao remover amizade:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtém contadores para badges
   */
  getCounts(): Observable<FriendshipCount> {
    return this.http.get<FriendshipCount>(`${this.apiUrl}/counts`).pipe(
      tap(counts => {
        console.log('📊 Contadores:', counts);
        this.countsSubject.next(counts);
      }),
      catchError(this.handleError('getCounts', {
        totalFriends: 0,
        pendingReceived: 0,
        pendingSent: 0
      }))
    );
  }

  /**
   * Atualiza todos os dados (amigos, convites e contadores)
   */
  refreshAll(): void {
    console.log('🔄 Atualizando todos os dados de amizade...');
    this.getFriends().subscribe();
    this.getReceivedRequests().subscribe();
    this.getSentRequests().subscribe();
    this.getCounts().subscribe();
  }

  /**
   * Atualiza apenas os contadores
   */
  refreshCounts(): void {
    this.getCounts().subscribe();
  }

  /**
   * Limpa todos os dados (logout)
   */
  clearAll(): void {
    this.friendsSubject.next([]);
    this.pendingReceivedSubject.next([]);
    this.pendingSentSubject.next([]);
    this.countsSubject.next({
      totalFriends: 0,
      pendingReceived: 0,
      pendingSent: 0
    });
  }

  /**
   * Tratamento de erros centralizado
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`❌ Erro em ${operation}:`, error);
      
      if (error.status === 0) {
        console.error('⚠️ CORS ou Backend não está acessível!');
      } else if (error.status === 401) {
        console.error('⚠️ Não autorizado. Token JWT inválido ou expirado.');
      } else if (error.status === 404) {
        console.error('⚠️ Recurso não encontrado.');
      } else if (error.status === 400) {
        console.error('⚠️ Requisição inválida:', error.error);
      }

      return result !== undefined ? of(result as T) : throwError(() => error);
    };
  }
}
