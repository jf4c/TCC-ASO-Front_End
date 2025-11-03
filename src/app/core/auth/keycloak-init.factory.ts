import { KeycloakService } from 'keycloak-angular'
import { environment } from '../../../environments/environment'

/**
 * Função para inicializar o Keycloak antes do bootstrap do Angular
 */
export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
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
}
