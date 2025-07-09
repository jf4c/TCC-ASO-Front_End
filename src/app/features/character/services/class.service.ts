import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Classes, Class } from '@characters/interface/class.model'

@Injectable({ providedIn: 'root' })
export class ClassService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:5174/api/Class'

  private readonly classes$ = new BehaviorSubject<Class[]>([])
  private readonly loading$ = new BehaviorSubject<boolean>(false)

  getClasses$(): Observable<Class[]> {
    return this.classes$.asObservable()
  }

  getLoading$(): Observable<boolean> {
    return this.loading$.asObservable()
  }

  loadClasses(): void {
    if (this.classes$.value.length > 0) return

    this.loading$.next(true)
    this.getClasses().subscribe({
      next: (data: Classes) => {
        console.log('Classes loaded:', data.classes)
        this.classes$.next(data.classes as Class[])
        this.loading$.next(false)
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar as classes:', error)
        this.loading$.next(false)
      },
    })
  }

  private getClasses(): Observable<Classes> {
    return this.http.get<Classes>(this.apiUrl)
  }
}
