import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import {
  Character,
  CharacterDetail,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  GetPaginatedCharacterRequest,
  GetPaginatedCharacterResponse,
  LevelUpRequest,
  LevelUpResponse,
} from '../interface/character.model'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/character`

  createCharacter(character: CreateCharacterRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, character)
  }

  getCharacterById(id: string): Observable<CharacterDetail> {
    return this.http.get<CharacterDetail>(`${this.apiUrl}/${id}`)
  }

  updateCharacter(id: string, data: UpdateCharacterRequest): Observable<CharacterDetail> {
    return this.http.patch<CharacterDetail>(`${this.apiUrl}/${id}`, data)
  }

  deleteCharacter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  levelUp(id: string, data: LevelUpRequest): Observable<LevelUpResponse> {
    return this.http.post<LevelUpResponse>(`${this.apiUrl}/${id}/level-up`, data)
  }

  getPaginatedCharacter(
    request: GetPaginatedCharacterRequest,
  ): Observable<GetPaginatedCharacterResponse> {
    const filteredParams = this.filterUndefinedParams(
      request as Record<string, unknown>,
    )
    return this.http.get<GetPaginatedCharacterResponse>(this.apiUrl, {
      params: filteredParams,
    })
  }

  /**
   * Busca personagens de um jogador específico.
   * Útil para seleção de personagens em campanhas.
   * @param playerId ID do jogador
   */
  getCharactersByPlayer(
    playerId: string,
  ): Observable<GetPaginatedCharacterResponse> {
    return this.http.get<GetPaginatedCharacterResponse>(
      `${this.apiUrl}/player/${playerId}`,
    )
  }

  private filterUndefinedParams(
    obj: Record<string, unknown>,
  ): Record<string, string | number | boolean> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value != null),
    ) as Record<string, string | number | boolean>
  }
}
