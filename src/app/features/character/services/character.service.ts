import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import {
  CreateCharacterRequest,
  GetPaginatedCharacterRequest,
  GetPaginatedCharacterResponse,
} from '../interface/character.model'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:5174/api/Character'

  createCharacter(character: CreateCharacterRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, character)
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

  private filterUndefinedParams(
    obj: Record<string, unknown>,
  ): Record<string, string | number | boolean> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value != null),
    ) as Record<string, string | number | boolean>
  }
}
