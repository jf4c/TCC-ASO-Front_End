import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { inject } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Ancestries, Ancestry } from '@characters/interface/ancestry.model'

@Injectable({ providedIn: 'root' })
export class AncestryService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:5174/api/Ancestry'

  private readonly ancestries$ = new BehaviorSubject<Ancestry[]>([])
  private readonly loading$ = new BehaviorSubject<boolean>(false)

  getAncestries$(): Observable<Ancestry[]> {
    return this.ancestries$.asObservable()
  }

  getLoading$(): Observable<boolean> {
    return this.loading$.asObservable()
  }

  loadAncestries(): void {
    if (this.ancestries$.value.length > 0) return

    this.loading$.next(true)
    this.getAncestries().subscribe({
      next: (data: Ancestries) => {
        console.log('Ancestries loaded:', data.ancestries)
        this.ancestries$.next(data.ancestries as Ancestry[])
        this.loading$.next(false)
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar as raças:', error)
        this.loading$.next(false)
      },
    })
  }

  private getAncestries(): Observable<Ancestries> {
    return this.http.get<Ancestries>(this.apiUrl)
  }
}
