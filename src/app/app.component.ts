import { Component, inject } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { LayoutComponent } from './core/layout/layout.component'

@Component({
  selector: 'aso-root',
  imports: [LayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'artificial-story-oracle'
  currentTheme: 'light' | 'dark' = 'dark'

  private router = inject(Router)

  constructor() {
    this.setTheme(this.currentTheme)
  }

  navigateHome() {
    this.router.navigate(['/'])
  }

  setTheme(theme: 'light' | 'dark') {
    document.body.classList.remove('light-theme', 'dark-theme')
    document.body.classList.add(`${theme}-theme`)
    this.currentTheme = theme
  }
}
