import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { ButtonComponent } from '@shared/components/button/button.component'
import { AuthService } from '@core/auth/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)

  async ngOnInit() {
    // Se já estiver logado, redireciona para home
    const isLoggedIn = this.authService.isLoggedIn()
    if (isLoggedIn) {
      this.router.navigate(['/home'])
    }
  }

  onLogin() {
    this.authService.login()
  }
}
