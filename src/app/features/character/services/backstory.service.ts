import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import {
  CharacterBackstoryRequest,
  CharacterBackstoryResponse,
} from '../interface/backstory.model'

@Injectable({
  providedIn: 'root',
})
export class BackstoryService {
  private readonly apiUrl = 'http://localhost:5174/api/Oracle'
  private readonly http = inject(HttpClient)

  generateBackstory(
    request: CharacterBackstoryRequest,
  ): Observable<CharacterBackstoryResponse> {
    return this.http.post<CharacterBackstoryResponse>(
      `${this.apiUrl}/character-backstory`,
      request,
    )
  }
}
