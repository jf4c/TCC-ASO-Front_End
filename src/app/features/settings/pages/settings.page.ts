import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { AuthService } from '@core/auth/auth.service'

@Component({
  selector: 'aso-settings-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  private auth = inject(AuthService)

  currentTheme: 'dark' | 'light' = (localStorage.getItem('aso-theme') as 'dark' | 'light') || 'dark'

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('aso-theme', this.currentTheme)
    document.body.classList.remove('dark-theme', 'light-theme')
    document.body.classList.add(`${this.currentTheme}-theme`)
  }

  logout() {
    this.auth.logout()
  }
}
