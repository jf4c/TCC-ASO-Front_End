import { AuthService } from './auth.service'
import { UserService } from '../../shared/services/user.service'
import { firstValueFrom } from 'rxjs'

/**
 * Factory para sincronizar usuário com backend após inicialização do Keycloak
 */
export function initializeUserSync(
  authService: AuthService,
  userService: UserService
) {
  return async (): Promise<void> => {
    // Verifica se está logado
    if (!authService.isLoggedIn()) {
      console.log('⏭️ Usuário não está logado, pulando sincronização');
      return
    }

    // Tenta recuperar usuário do localStorage
    const cachedUser = userService.getCurrentUser()
    
    // Se não tem usuário em cache, sincroniza com backend
    if (!cachedUser) {
      try {
        console.log('🔄 Sincronizando usuário com o backend...')
        await firstValueFrom(authService.syncUserWithBackend())
        console.log('✅ Usuário sincronizado com sucesso!')
      } catch (error) {
        console.error('❌ Erro ao sincronizar usuário:', error)
        // Não bloqueia a inicialização do app
      }
    } else {
      console.log('✅ Usuário recuperado do cache:', cachedUser.nickName)
    }
  }
}
