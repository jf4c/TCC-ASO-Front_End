import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'
import { from, switchMap } from 'rxjs'

/**
 * Interceptor que adiciona o token JWT em todas as requisições HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  // URLs que não precisam de autenticação
  const excludedUrls = ['/assets/', '/public/']
  const isExcluded = excludedUrls.some((url) => req.url.includes(url))

  if (isExcluded) {
    return next(req)
  }

  // Adiciona o token no header
  return from(authService.getToken()).pipe(
    switchMap((token) => {
      if (token) {
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
        return next(clonedRequest)
      }
      return next(req)
    }),
  )
}
