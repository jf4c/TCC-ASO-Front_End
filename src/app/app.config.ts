import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { providePrimeNG } from 'primeng/config'
// import Aura from '@primeng/themes/aura'

import { routes } from './app.routes'
import { ASO } from './theme/theme.config'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ASO,
      },
      ripple: true,
    }),
  ],
}
