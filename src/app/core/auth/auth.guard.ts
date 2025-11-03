import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from './auth.service'

/**
 * Guard para proteger rotas que exigem autenticação
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const isLoggedIn = authService.isLoggedIn()

  if (!isLoggedIn) {
    // Se não estiver logado, redireciona para login
    authService.login()
    return false
  }

  // Verifica se a rota exige uma role específica
  const requiredRoles = route.data['roles'] as string[]
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) =>
      authService.hasRole(role),
    )

    if (!hasRequiredRole) {
      // Usuário não tem permissão, redireciona para home
      router.navigate(['/home'])
      return false
    }
  }

  return true
}
