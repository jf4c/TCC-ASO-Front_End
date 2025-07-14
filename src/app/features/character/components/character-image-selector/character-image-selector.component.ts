import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonComponent } from '@shared/components/button/button.component'

@Component({
  selector: 'aso-character-image-selector',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './character-image-selector.component.html',
  styleUrl: './character-image-selector.component.scss',
})
export class CharacterImageSelectorComponent {
  private readonly dialogRef = inject(DynamicDialogRef)
  private readonly config = inject(DynamicDialogConfig)

  images: string[] = []
  selectedImageIndex: number | null = null

  constructor() {
    this.images = this.config.data?.images || []
    const currentImage = this.config.data?.currentImage
    if (currentImage) {
      this.selectedImageIndex = this.images.indexOf(currentImage)
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index
  }

  cancel(): void {
    this.dialogRef.close()
  }

  confirm(): void {
    if (this.selectedImageIndex !== null) {
      const selectedImage = this.images[this.selectedImageIndex]
      this.dialogRef.close(selectedImage)
    }
  }
}
