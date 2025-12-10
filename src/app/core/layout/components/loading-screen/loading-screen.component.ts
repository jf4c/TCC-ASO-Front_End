import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'aso-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-screen" *ngIf="isLoading">
      <div class="loading-content">
        <div class="spinner-container">
          <i class="pi pi-spin pi-spinner"></i>
        </div>
        <h2>Carregando seus dados</h2>
        <p>Aguarde enquanto preparamos tudo para você...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.98);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .loading-content {
      text-align: center;
      padding: 3rem;
      background: var(--surface-secondary);
      border-radius: 16px;
      border: 2px solid var(--accent-secondary);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .spinner-container {
      margin-bottom: 2rem;
      
      i {
        font-size: 4rem;
        color: var(--accent-primary);
      }
    }

    h2 {
      color: var(--text-primary);
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
    }

    p {
      color: var(--text-secondary);
      font-size: 1rem;
      margin: 0;
    }
  `]
})
export class LoadingScreenComponent implements OnInit {
  private userService = inject(UserService);
  
  isLoading = false;

  ngOnInit() {
    this.userService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
}
