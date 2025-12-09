import { Component, OnInit, inject, HostListener } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { BadgeModule } from 'primeng/badge'
import { AuthService } from '@core/auth/auth.service'
import { UserService } from '@shared/services/user.service'
import { FriendshipService } from '@features/friends/services/friendship.service'
import { AvatarComponent } from '@shared/components/avatar/avatar.component'

@Component({
  selector: 'aso-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ButtonModule, BadgeModule, AvatarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService)
  private userService = inject(UserService)
  private friendshipService = inject(FriendshipService)
  private router = inject(Router)

  isLoggedIn = false
  username = ''
  playerName = ''
  userPhotoUrl: string | null = null
  pendingRequestsCount = 0
  
  // Menu states
  isUserMenuOpen = false
  isMobileNavOpen = false

  async ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      // Busca dados do player do backend
      this.userService.currentUser$.subscribe(user => {
        if (user) {
          
          // Backend retorna: Email, NickName, FirstName, LastName (PascalCase)
          this.username = user.nickName || 'Usuário'
          this.playerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Player'
          
        }
      })

      // Se não tiver em cache, tenta pegar do localStorage
      const cachedUser = this.userService.getCurrentUser()
      if (cachedUser) {
        this.username = cachedUser.nickName || 'Usuário'
        this.playerName = `${cachedUser.firstName || ''} ${cachedUser.lastName || ''}`.trim() || 'Player'
      }

      // Subscrever aos contadores de amizade
      this.friendshipService.counts$.subscribe(counts => {
        this.pendingRequestsCount = counts.pendingReceived
      })

      // Carregar contadores inicialmente
      this.friendshipService.getCounts().subscribe()
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

  goToProfile() {
    this.router.navigate(['/perfil'])
  }

  goToFriends() {
    this.router.navigate(['/amigos'])
  }

  toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    
    document.body.classList.toggle('dark-theme', newTheme === 'dark')
    localStorage.setItem('aso-theme', newTheme)
  }
}
