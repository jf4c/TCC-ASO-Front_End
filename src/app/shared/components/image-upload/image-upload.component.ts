import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { UploadService, UploadType } from '../../services/upload.service';

@Component({
  selector: 'aso-image-upload',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  private readonly uploadService = inject(UploadService);
  private readonly uniqueId = `upload-${Math.random().toString(36).substring(2, 9)}`;

  @Input() uploadType: UploadType = 'world';
  @Input() currentImageUrl?: string | null;
  @Input() label = 'Imagem';
  @Input() aspectRatio: '16:9' | '1:1' | '4:3' = '16:9';
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  uploadProgress = signal(0);
  error = signal<string | null>(null);
  isDragOver = signal(false);

  constructor() {
    // Atualiza preview quando currentImageUrl mudar
    effect(() => {
      if (this.currentImageUrl) {
        const fullUrl = this.uploadService.getImageUrl(this.currentImageUrl);
        this.previewUrl.set(fullUrl);
      } else if (!this.isUploading()) {
        this.previewUrl.set(null);
      }
    });
  }

  getFileInputId(): string {
    return `file-input-${this.uniqueId}`;
  }

  /**
   * Abre seletor de arquivo
   */
  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  /**
   * Drag and drop
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.handleFile(files[0]);
    }
  }

  /**
   * Processa arquivo selecionado
   */
  private handleFile(file: File): void {
    this.error.set(null);

    // Validar arquivo
    const validation = this.uploadService.validateImage(file);
    if (!validation.valid) {
      this.error.set(validation.error || 'Erro ao validar arquivo');
      return;
    }

    // Gerar preview local
    this.uploadService.generatePreview(file).subscribe({
      next: (preview) => {
        this.previewUrl.set(preview);
      },
      error: (err) => {
        // Erro ao gerar preview
      },
    });

    // Fazer upload
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.uploadService
      .uploadImageWithProgress(file, this.uploadType)
      .subscribe({
        next: (progress) => {
          this.uploadProgress.set(progress.progress);
          if (progress.url) {
            this.imageUploaded.emit(progress.url);
            this.isUploading.set(false);
          }
        },
        error: (err) => {
          this.error.set(
            err.error?.error || 'Erro ao fazer upload. Tente novamente.'
          );
          this.isUploading.set(false);
          this.uploadProgress.set(0);
          this.previewUrl.set(null);
        },
      });
  }

  /**
   * Remove imagem
   */
  onRemoveImage(): void {
    this.previewUrl.set(null);
    this.error.set(null);
    this.uploadProgress.set(0);
    this.imageRemoved.emit();
  }

  /**
   * Abre seletor de arquivo via botão
   */
  triggerFileInput(): void {
    const fileInput = document.getElementById(this.getFileInputId()) as HTMLInputElement;
    fileInput?.click();
  }
}
