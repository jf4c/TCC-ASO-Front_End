import { Injectable, inject } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import { KeycloakProfile } from 'keycloak-js'
import { from, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakService = inject(KeycloakService)

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
   */
  getUsername(): string {
    return this.keycloakService.getUsername()
  }

  /**
   * Força atualização do token
   */
  updateToken(): Observable<boolean> {
    return from(this.keycloakService.updateToken())
  }
}
