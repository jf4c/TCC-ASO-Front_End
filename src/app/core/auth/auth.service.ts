import { Injectable, inject } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import { KeycloakProfile } from 'keycloak-js'
import { from, Observable } from 'rxjs'
import { UserService } from '../../shared/services/user.service'
import { switchMap, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakService = inject(KeycloakService)
  private userService = inject(UserService)

  /**
   * Verifica se o usuário está autenticado
   */
  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn()
  }

  /**
   * Realiza o login redirecionando para o Keycloak
   */
  login(): void {
    this.keycloakService.login()
  }

  /**
   * Realiza o logout
   */
  logout(): void {
    this.userService.clearUser()
    this.keycloakService.logout(window.location.origin)
  }

  /**
   * Obtém o perfil do usuário autenticado
   */
  getUserProfile(): Observable<KeycloakProfile> {
    return from(this.keycloakService.loadUserProfile())
  }

  /**
   * Obtém o token JWT do usuário
   */
  getToken(): Promise<string> {
    return this.keycloakService.getToken()
  }

  /**
   * Verifica se o usuário tem uma role específica
   */
  hasRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role)
  }

  /**
   * Obtém todas as roles do usuário
   */
  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles()
  }

  /**
   * Obtém o nome do usuário autenticado
   * Retorna string vazia se não estiver disponível
   */
  getUsername(): string {
    try {
      return this.keycloakService.getUsername()
    } catch (error) {
      console.warn('Username não disponível:', error)
      return ''
    }
  }

  /**
   * Força atualização do token
   */
  updateToken(): Observable<boolean> {
    return from(this.keycloakService.updateToken())
  }

  /**
   * Sincroniza usuário com o backend após login
   * Deve ser chamado após autenticação bem-sucedida
   */
  syncUserWithBackend(): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(token => this.userService.syncUser(token)),
    )
  }

  /**
   * Obtém o ID do player atual do backend
   */
  getPlayerId(): string | null {
    const user = this.userService.getCurrentUser()
    return user?.id || null
  }

  /**
   * Obtém o subject (sub) do token Keycloak como fallback
   */
  getKeycloakSubject(): string | null {
    try {
      const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed
      return tokenParsed?.sub || null
    } catch (error) {
      console.error('Erro ao obter subject do Keycloak:', error)
      return null
    }
  }
}
