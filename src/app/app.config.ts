import {
  ApplicationConfig,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { providePrimeNG } from 'primeng/config'
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { KeycloakService } from 'keycloak-angular'

import { routes } from './app.routes'
import { ASO } from './theme/theme.config'
import { initializeKeycloak } from './core/auth/keycloak-init.factory'
import { authInterceptor } from './core/auth/auth.interceptor'
import { AuthService } from './core/auth/auth.service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor]),
    ),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ASO,
      },
      ripple: true,
    }),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthService],
    },
  ],
}
