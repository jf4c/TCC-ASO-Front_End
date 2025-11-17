import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { WorldService } from '../../services/world.service';
import { World } from '../../interfaces/world.model';

@Component({
  selector: 'app-list-worlds',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './list-worlds.page.html',
  styleUrl: './list-worlds.page.scss',
})
export class ListWorldsPage implements OnInit {
  private readonly worldService = inject(WorldService);
  private readonly router = inject(Router);

  worlds = signal<World[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadWorlds();
  }

  /**
   * Carrega lista de mundos disponíveis
   */
  private loadWorlds(): void {
    this.isLoading.set(true);
    this.worldService.listWorlds().subscribe({
      next: (worlds) => {
        this.worlds.set(worlds);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar mundos:', error);
        this.isLoading.set(false);
        // Mock data para desenvolvimento
        this.worlds.set([
          {
            id: '1',
            name: 'Arton',
            description: 'O mundo de Tormenta20, lar de deuses, heróis e a ameaça da Tormenta.',
            imageUrl: '/assets/worlds/arton.jpg',
            creatorId: 'user1',
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          },
        ]);
      },
    });
  }

  /**
   * Navega para página de criação de mundo
   */
  onCreateWorld(): void {
    this.router.navigate(['/mundos/create']);
  }

  /**
   * Navega para detalhes do mundo
   */
  onViewWorld(worldId: string): void {
    this.router.navigate(['/mundos', worldId]);
  }
}
