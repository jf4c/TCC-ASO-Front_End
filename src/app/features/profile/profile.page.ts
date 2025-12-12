import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/interfaces/user.interface';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'aso-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ImageUploadComponent,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  
  user = signal<User | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.currentUser$.subscribe(user => {
      this.user.set(user);
    });
  }

  onImageUploaded(imageUrl: string): void {
    this.isLoading.set(true);
    
    this.userService.updateAvatar(imageUrl).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Foto de perfil atualizada com sucesso!'
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao atualizar avatar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar foto de perfil'
        });
        this.isLoading.set(false);
      }
    });
  }

  onImageRemoved(): void {
    this.isLoading.set(true);
    
    this.userService.updateAvatar('').subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Foto de perfil removida com sucesso!'
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao remover avatar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao remover foto de perfil'
        });
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
