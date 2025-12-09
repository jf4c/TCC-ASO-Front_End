import { Component, OnInit, OnDestroy } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogFooterComponent } from '@shared/layout/dialog-footer/dialog-footer.component'
import { FileUploadModule } from 'primeng/fileupload'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { TabsModule } from 'primeng/tabs'
import { SkeletonModule } from 'primeng/skeleton'
import { ImageService } from '@characters/services/image.service'
import { Image } from '@characters/interface/image.model'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'aso-character-dialog-image',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogFooterComponent,
    FileUploadModule,
    ToastModule,
    TabsModule,
    SkeletonModule,
  ],
  styleUrl: './character-dialog-image.component.scss',
  templateUrl: './character-dialog-image.component.html',
  providers: [DialogService, MessageService],
})
export class CharacterDialogImageComponent implements OnInit, OnDestroy {
  private readonly dialogService = inject(DialogService)
  private readonly dialogRef = inject(DynamicDialogRef)
  private readonly messageService = inject(MessageService)
  private readonly imageService = inject(ImageService)
  private readonly destroy$ = new Subject<void>()

  skeletonItems = Array.from({ length: 9 }, (_, i) => i)
  apiImages: Image[] = []
  imagesLoading = false

  selectedImageIndex: number | null = null
  activeTab = '0'

  ngOnInit(): void {
    this.imagesLoading = true

    this.imageService.loadImages()

    this.imageService
      .getLoading$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.imagesLoading = loading
      })

    this.imageService
      .getImages$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((images) => {
        this.apiImages = images
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  get isImagesLoading(): boolean {
    return this.imagesLoading
  }

  get hasApiImages(): boolean {
    return this.apiImages && this.apiImages.length > 0
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index
  }

  getSelectedImage(): Image | null {
    return this.selectedImageIndex !== null &&
      this.apiImages &&
      this.apiImages[this.selectedImageIndex]
      ? this.apiImages[this.selectedImageIndex]
      : null
  }

  showInfo() {
  }

  onClose(): void {
    this.dialogRef.close()
  }
  onSave(): void {
    const selectedImage = this.getSelectedImage()

    if (selectedImage) {
      // Retorna objeto com id (para salvar) e url (para preview)
      this.dialogRef.close({ 
        id: selectedImage.id, 
        url: selectedImage.url 
      })

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Imagem selecionada com sucesso',
      })
    } else {
      // Mostra erro se nenhuma imagem foi selecionada
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, selecione uma imagem antes de salvar',
      })
    }
  }
}
