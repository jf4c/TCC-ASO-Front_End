import { KeycloakService } from 'keycloak-angular'
import { environment } from '../../../environments/environment'
import { AuthService } from './auth.service'
import { firstValueFrom } from 'rxjs'

/**
 * Função para inicializar o Keycloak antes do bootstrap do Angular
 */
export function initializeKeycloak(
  keycloak: KeycloakService,
  authService: AuthService
): () => Promise<boolean> {
  return async () => {
    const authenticated = await keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'login-required', // Força redirecionamento automático para Keycloak se não estiver autenticado
        checkLoginIframe: false, // Desabilita iframe check para evitar problemas de CORS
      },
      // Atualiza o token quando faltar 30 segundos para expirar
      bearerExcludedUrls: ['/assets', '/public'],
    })

    // Se autenticado, sincroniza usuário com backend
    if (authenticated) {
      try {
        await firstValueFrom(authService.syncUserWithBackend())
      } catch (error) {
        console.error('Erro ao sincronizar usuário:', error)
      }
    }

    return authenticated
  }
}
