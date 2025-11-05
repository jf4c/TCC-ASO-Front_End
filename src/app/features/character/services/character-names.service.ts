import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { CharacterNamesResponse } from '../interface/character-names.model'

@Injectable({
  providedIn: 'root',
})
export class CharacterNamesService {
  private readonly apiUrl = 'http://localhost:5174/api/Oracle'
  private readonly http = inject(HttpClient)

  generateNames(
    ancestryId?: string,
    classId?: string,
  ): Observable<CharacterNamesResponse> {
    let params = new HttpParams()

    if (ancestryId) {
      params = params.set('AncestryId', ancestryId)
    }

    if (classId) {
      params = params.set('ClassId', classId)
    }

    return this.http.get<CharacterNamesResponse>(
      `${this.apiUrl}/character-names`,
      { params },
    )
  }
}
