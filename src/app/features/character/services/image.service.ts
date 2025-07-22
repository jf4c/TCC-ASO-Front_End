import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Image, Images } from '@characters/interface/image.model'

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:5174/api/Image'

  private readonly images$ = new BehaviorSubject<Image[]>([])
  private readonly loading$ = new BehaviorSubject<boolean>(false)

  getImages$(): Observable<Image[]> {
    return this.images$.asObservable()
  }

  getLoading$(): Observable<boolean> {
    return this.loading$.asObservable()
  }

  loadImages(): void {
    // Verifica se já existem imagens carregadas
    const currentImages = this.images$.value
    if (currentImages && currentImages.length > 0) {
      return
    }

    this.loading$.next(true)
    this.getImages().subscribe({
      next: (data: Images) => {
        this.images$.next(data.images as Image[])
        this.loading$.next(false)
      },
      error: (error: unknown) => {
        console.error('Error loading images from API:', error)

        // Fallback para imagens locais
        this.loading$.next(false)
      },
    })
  }

  private getImages(): Observable<Images> {
    return this.http.get<Images>(this.apiUrl)
  }
}
