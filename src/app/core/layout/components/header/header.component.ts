import { Component, OnInit, inject } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api'
import { AuthService } from '@core/auth/auth.service'

@Component({
  selector: 'aso-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ButtonModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)

  isLoggedIn = false
  username = ''
  userMenuItems: MenuItem[] = []

  async ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.username = this.authService.getUsername()
      this.setupUserMenu()
    }
  }

  private setupUserMenu() {
    this.userMenuItems = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        command: () => this.goToSettings(),
      },
      {
        separator: true,
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout(),
      },
    ]
  }

  onLogin() {
    this.authService.login()
  }

  onLogout() {
    this.authService.logout()
  }

  goToProfile() {
    // TODO: Implementar navegação para perfil
    console.log('Ir para perfil')
  }

  goToSettings() {
    // Navega para a página de configurações (theme, preferências, etc)
    this.router.navigate(['/settings'])
  }
}
