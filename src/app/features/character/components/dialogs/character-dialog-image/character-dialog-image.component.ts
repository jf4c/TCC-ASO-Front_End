import { Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogFooterComponent } from '@shared/layout/dialog-footer/dialog-footer.component'
import { FileUploadModule } from 'primeng/fileupload'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { TabsModule } from 'primeng/tabs'

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
  ],
  styleUrl: './character-dialog-image.component.scss',
  templateUrl: './character-dialog-image.component.html',
  providers: [DialogService, MessageService],
})
export class CharacterDialogImageComponent {
  private readonly dialogService = inject(DialogService)
  private readonly dialogRef = inject(DynamicDialogRef)
  private readonly messageService = inject(MessageService)

  characterImages: string[] = [
    './assets/Character/assassin1.png',
    './assets/Character/assassin2.png',
    './assets/Character/bard.png',
    './assets/Character/bard2.png',
    './assets/Character/mage1.png',
    './assets/Character/mage2.png',
    './assets/Character/mage3.png',
    './assets/Character/mage4.png',
    './assets/Character/mage5.png',
    './assets/Character/mage6.png',
    './assets/Character/monk1.png',
    './assets/Character/orch.png',
    './assets/Character/orch1.png',
    './assets/Character/priest1.png',
    './assets/Character/priest2.png',
    './assets/Character/rogue1.png',
    './assets/Character/warrior1.png',
    './assets/Character/warrior2.png',
    './assets/Character/warrior3.png',
    './assets/Character/warrior4.png',
  ]

  selectedImageIndex: number | null = null
  activeTab = '0'

  selectImage(index: number): void {
    this.selectedImageIndex = index
    // Aqui você pode emitir um evento para o componente pai
    // ou armazenar a imagem selecionada
  }

  onImageSelect(event: { files: File[] }): void {
    const file = event.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl = e.target?.result as string
        // Adiciona a nova imagem à lista
        this.characterImages.push(imageUrl)
        // Seleciona automaticamente a nova imagem
        this.selectedImageIndex = this.characterImages.length - 1

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Imagem adicionada com sucesso',
        })
      }
      reader.readAsDataURL(file)
    }
  }

  getSelectedImage(): string | null {
    return this.selectedImageIndex !== null
      ? this.characterImages[this.selectedImageIndex]
      : null
  }

  showInfo() {
    console.log('showInfo')
  }

  onClose(): void {
    this.dialogRef.close()
  }
  onSave(): void {
    const selectedImage = this.getSelectedImage()

    if (selectedImage) {
      // Fecha o dialog e retorna a imagem selecionada
      this.dialogRef.close(selectedImage)

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
