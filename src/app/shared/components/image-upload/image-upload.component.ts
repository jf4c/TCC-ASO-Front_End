import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
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

  ngOnInit(): void {
    if (this.currentImageUrl) {
      const fullUrl = this.uploadService.getImageUrl(this.currentImageUrl);
      this.previewUrl.set(fullUrl);
    }
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
        console.error('Erro ao gerar preview:', err);
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
          console.error('Erro ao fazer upload:', err);
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
    const fileInput = document.getElementById(
      'file-input-' + this.uploadType
    ) as HTMLInputElement;
    fileInput?.click();
  }
}
