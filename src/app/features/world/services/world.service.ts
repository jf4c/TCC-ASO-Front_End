import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  World, 
  WorldDetail, 
  CreateWorldDto, 
  UpdateWorldDto 
} from '../interfaces/world.model';

@Injectable({
  providedIn: 'root',
})
export class WorldService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/World`;

  /**
   * Lista todos os mundos disponíveis
   */
  listWorlds(): Observable<World[]> {
    // TODO: Descomentar quando backend implementar endpoint de mundos
    // return this.http.get<World[]>(this.apiUrl);
    
    // Mock temporário
    return new Observable((observer) => {
      observer.next([
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
      observer.complete();
    });
  }

  /**
   * Busca detalhes completos de um mundo por ID
   */
  getWorldById(id: string): Observable<WorldDetail> {
    // TODO: Descomentar quando backend implementar endpoint de mundos
    // return this.http.get<WorldDetail>(`${this.apiUrl}/${id}`);
    
    // Mock temporário
    return new Observable((observer) => {
      observer.next({
        id: '1',
        name: 'Arton',
        description: 'O mundo de Tormenta20, lar de deuses, heróis e a ameaça da Tormenta.',
        imageUrl: '/assets/worlds/arton.jpg',
        creatorId: 'user1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        lore: [
          {
            id: 'lore1',
            title: 'Arton: O Mundo Conhecido',
            content: 'Arton é um mundo vasto e diverso, repleto de reinos poderosos, cidades prósperas e perigos ocultos.',
          },
        ],
        locations: [
          {
            id: 'loc1',
            title: 'Valkaria',
            description: 'Capital do Reinado, maior cidade de Arton.',
          },
        ],
        pantheon: [
          {
            id: 'god1',
            name: 'Khalmyr',
            title: 'Deus da Justiça',
            description: 'Deus da justiça e honra.',
            domains: ['Justiça', 'Guerra', 'Honra'],
          },
        ],
      });
      observer.complete();
    });
  }

  /**
   * Cria um novo mundo
   */
  createWorld(dto: CreateWorldDto): Observable<WorldDetail> {
    return this.http.post<WorldDetail>(this.apiUrl, dto);
  }

  /**
   * Atualiza um mundo existente
   */
  updateWorld(id: string, dto: UpdateWorldDto): Observable<WorldDetail> {
    return this.http.patch<WorldDetail>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Deleta um mundo por ID
   */
  deleteWorld(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
