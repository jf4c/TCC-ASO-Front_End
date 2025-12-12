import { Component, OnInit, inject, HostListener } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { BadgeModule } from 'primeng/badge'
import { AuthService } from '@core/auth/auth.service'
import { UserService } from '@shared/services/user.service'
import { FriendshipService } from '@features/friends/services/friendship.service'
import { AvatarComponent } from '@shared/components/avatar/avatar.component'
import { environment } from '../../../../../environments/environment'

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
  isLoadingUser = false
  
  // Menu states
  isUserMenuOpen = false
  isMobileNavOpen = false

  async ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      // Simplesmente inscreve no observable do usuário
      this.userService.currentUser$.subscribe(user => {
        if (user) {
          this.username = user.nickName || 'Usuário'
          this.playerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Player'
          // Converte path relativo para URL completa
          this.userPhotoUrl = user.avatar ? this.getImageUrl(user.avatar) : null
        }
      })

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
    
    console.log('🎨 Mudando tema:', currentTheme, '→', newTheme)
    
    document.body.classList.remove('dark-theme', 'light-theme')
    document.body.classList.add(`${newTheme}-theme`)
    localStorage.setItem('aso-theme', newTheme)
    
    console.log('✅ Classes do body:', document.body.classList.toString())
  }

  /**
   * Converte path relativo para URL completa
   */
  private getImageUrl(relativePath: string): string {
    if (relativePath.startsWith('http')) return relativePath;
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${cleanPath}`;
  }
}
