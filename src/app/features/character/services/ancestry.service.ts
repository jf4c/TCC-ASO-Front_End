import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { Ancestries } from '@features/character/interface/ancestry.model'

@Injectable({ providedIn: 'root' })
export class AncestryService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:5174/api/Ancestry'

  getAncestries() {
    return this.http.get<Ancestries>(this.apiUrl)
  }
}
