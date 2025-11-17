import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  url: string;
  filename: string;
}

export interface UploadProgress {
  progress: number;
  url?: string;
}

export type UploadType = 'world' | 'campaign' | 'character' | 'avatar';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Faz upload de uma imagem para o tipo especificado
   */
  uploadImage(
    file: File,
    type: UploadType
  ): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<UploadResponse>(`${this.apiUrl}/Uploads/${type}`, formData)
      .pipe(
        catchError((error) => {
          console.error(`Erro ao fazer upload de ${type}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Faz upload com progresso
   */
  uploadImageWithProgress(
    file: File,
    type: UploadType
  ): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<UploadResponse>(`${this.apiUrl}/Uploads/${type}`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = event.total
              ? Math.round((100 * event.loaded) / event.total)
              : 0;
            return { progress };
          } else if (event.type === HttpEventType.Response) {
            return { progress: 100, url: event.body?.url };
          }
          return { progress: 0 };
        }),
        catchError((error) => {
          console.error(`Erro ao fazer upload de ${type}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Valida o arquivo antes do upload
   */
  validateImage(file: File): {
    valid: boolean;
    error?: string;
  } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo inválido. Use JPG, PNG ou WebP.',
      };
    }

    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Tamanho máximo: 5MB.',
      };
    }

    return { valid: true };
  }

  /**
   * Gera URL completa da imagem
   */
  getImageUrl(relativePath: string | null | undefined): string | null {
    if (!relativePath) return null;
    if (relativePath.startsWith('http')) return relativePath;
    return `${this.apiUrl}${relativePath}`;
  }

  /**
   * Gera preview local do arquivo antes do upload
   */
  generatePreview(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        observer.next(e.target?.result as string);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsDataURL(file);
    });
  }
}
