import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Sincroniza usuário com o backend após login
   * 1. Tenta GET /api/player (buscar player existente)
   * 2. Se 404, chama POST /api/player (criar novo)
   * 3. Após POST, faz polling até o player estar pronto
   */
  syncUser(token: string): Observable<User> {
    this.loadingSubject.next(true);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Primeiro tenta buscar player existente
    return this.http.get<User>(`${this.apiUrl}/Player`, { headers }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        // Se retornou 404, player não existe - criar novo
        if (error.status === 404) {
          return this.http.post<User>(`${this.apiUrl}/Player`, {}, { headers }).pipe(
            switchMap(() => {
              // POST disparou o evento, agora faz polling até player estar pronto
              return this.pollPlayerCreation(headers, 0);
            }),
            catchError((postError: HttpErrorResponse) => {
              this.loadingSubject.next(false);
              return throwError(() => postError);
            })
          );
        }
        
        // Outros erros
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Faz polling para verificar se o player foi criado
   * Tenta até 10 vezes com intervalo de 500ms
   */
  private pollPlayerCreation(headers: HttpHeaders, attempt: number): Observable<User> {
    if (attempt >= 10) {
      this.loadingSubject.next(false);
      return throwError(() => new Error('Timeout ao criar player'));
    }

    return new Observable<User>(observer => {
      setTimeout(() => {
        this.http.get<User>(`${this.apiUrl}/Player`, { headers }).subscribe({
          next: (user) => {
            this.currentUserSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.loadingSubject.next(false);
            observer.next(user);
            observer.complete();
          },
          error: (error) => {
            if (error.status === 404) {
              // Tenta novamente
              this.pollPlayerCreation(headers, attempt + 1).subscribe({
                next: (user) => {
                  observer.next(user);
                  observer.complete();
                },
                error: (err) => {
                  observer.error(err);
                }
              });
            } else {
              this.loadingSubject.next(false);
              observer.error(error);
            }
          }
        });
      }, 500);
    });
  }

  /**
   * Obtém usuário atual do localStorage
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      return user;
    }
    return null;
  }

  /**
   * Limpa dados do usuário (logout)
   */
  clearUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  /**
   * Verifica se usuário está sincronizado
   */
  isUserSynced(): boolean {
    return !!this.currentUserSubject.value;
  }
}
