import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { CreateCharacterRequest } from '../interface/character.model'
import { Observable } from 'rxjs/internal/Observable'

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:5174/api/Character'

  createCharacter(character: CreateCharacterRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, character)
  }
}
