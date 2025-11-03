import { Component, OnInit, inject, HostListener } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { AuthService } from '@core/auth/auth.service'
import { AvatarComponent } from '@shared/components/avatar/avatar.component'

@Component({
  selector: 'aso-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ButtonModule, AvatarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService)

  isLoggedIn = false
  username = ''
  userPhotoUrl: string | null = null
  
  // Menu states
  isUserMenuOpen = false
  isMobileNavOpen = false

  async ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.username = this.authService.getUsername()
      // TODO: Buscar foto do perfil quando disponível
      // const profile = await this.authService.getUserProfile().toPromise()
      // this.userPhotoUrl = profile?.attributes?.photoUrl?.[0] || null
    }
  }

  // Click outside listener para fechar menus
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (!target.closest('.user-section') && !target.closest('.nav-bar')) {
      this.isUserMenuOpen = false
      this.isMobileNavOpen = false
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen
    this.isMobileNavOpen = false // Fecha o nav mobile se aberto
  }

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen
    this.isUserMenuOpen = false // Fecha o menu de usuário se aberto
  }

  closeAllMenus() {
    this.isUserMenuOpen = false
    this.isMobileNavOpen = false
  }

  onLogin() {
    this.authService.login()
  }

  onLogout() {
    this.authService.logout()
  }

  toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    
    document.body.classList.toggle('dark-theme', newTheme === 'dark')
    localStorage.setItem('aso-theme', newTheme)
  }
}
