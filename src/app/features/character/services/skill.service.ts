import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Skill, Skills } from '@characters/interface/skill.model'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:5174/api/Skill'

  private readonly skills$ = new BehaviorSubject<Skill[]>([])
  private readonly loading$ = new BehaviorSubject<boolean>(false)

  getSkills$(): Observable<Skill[]> {
    return this.skills$.asObservable()
  }

  getLoading$(): Observable<boolean> {
    return this.loading$.asObservable()
  }

  loadSkills(): void {
    if (this.skills$.value.length > 0) return

    this.loading$.next(true)
    this.getSkills().subscribe({
      next: (data: Skills) => {
        this.skills$.next(data.skills as Skill[])
        this.loading$.next(false)
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar as habilidades:', error)
        this.loading$.next(false)
      },
    })
  }

  private getSkills(): Observable<Skills> {
    return this.http.get<Skills>(this.apiUrl)
  }
}
