import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

  /**
   * Sincroniza usuário com o backend após login
   * 1. Tenta GET /api/player (buscar player existente)
   * 2. Se 404, chama POST /api/player (criar novo)
   * 3. Se 200, usa dados retornados
   */
  syncUser(token: string): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    
    // Primeiro tenta buscar player existente
    return this.http.get<User>(`${this.apiUrl}/Player`, { headers }).pipe(
      tap(user => {

        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

      }),
      catchError((error: HttpErrorResponse) => {
        // Se retornou 404, player não existe - criar novo
        if (error.status === 404) {


          
          return this.http.post<User>(`${this.apiUrl}/Player`, {}, { headers }).pipe(
            tap(user => {

              this.currentUserSubject.next(user);
              localStorage.setItem('currentUser', JSON.stringify(user));

            }),
            catchError((postError: HttpErrorResponse) => {
              console.error('❌ Erro ao criar player:');
              console.error('Status:', postError.status);
              console.error('Message:', postError.message);
              return throwError(() => postError);
            })
          );
        }
        
        // Outros erros (CORS, 401, 500, etc)
        console.error('❌ Erro ao buscar player:');
        console.error('Status:', error.status);
        console.error('URL:', error.url);
        console.error('Message:', error.message);
        
        if (error.status === 0) {
          console.error('⚠️ CORS ou Backend não está acessível!');
          console.error('Verifique:');
          console.error('1. Backend está rodando em http://localhost:5174');
          console.error('2. CORS está configurado no backend para aceitar http://localhost:4200');
          console.error('3. Backend aceita Authorization header');
        }
        
        return throwError(() => error);
      })
    );
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
