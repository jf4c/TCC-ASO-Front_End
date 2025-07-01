import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Classes } from '@features/character/interface/class.model'

@Injectable({ providedIn: 'root' })
export class ClassService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:5174/api/Class'

  getClasses() {
    return this.http.get<Classes>(this.apiUrl)
  }
}
