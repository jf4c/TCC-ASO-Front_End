import { Component, input, output, signal, inject, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'

import { InputComponent } from '../../../../../shared/components/input/input.component'
import { TextareaComponent } from '../../../../../shared/components/textarea/textarea.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { JournalChapter } from '../campaign-journal.component'

export interface ChapterDialogData {
  entryId: string
  chapter?: JournalChapter
  isEditing: boolean
}

@Component({
  selector: 'aso-chapter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
  ],
  templateUrl: './chapter-dialog.component.html',
  styleUrl: './chapter-dialog.component.scss',
})
export class ChapterDialogComponent {
  visible = input.required<boolean>()
  data = input<ChapterDialogData | null>(null)

  save = output<{ title: string; content: string }>()
  cancelDialog = output<void>()

  chapterTitle = signal<string>('')
  chapterContent = signal<string>('')
  showValidation = signal<boolean>(false)

  dialogTitle = signal<string>('')

  isValid = () => {
    return this.chapterTitle().trim().length > 0
  }

  constructor() {
    // Efeito para atualizar os dados quando o dialog é aberto
    effect(() => {
      const dialogData = this.data()
      if (dialogData) {
        this.showValidation.set(false) // Reset validation
        if (dialogData.isEditing && dialogData.chapter) {
          // Modo de edição
          this.chapterTitle.set(dialogData.chapter.title)
          this.chapterContent.set(dialogData.chapter.content)
          this.dialogTitle.set('Editar Capítulo')
        } else {
          // Modo de criação
          this.chapterTitle.set('')
          this.chapterContent.set('')
          this.dialogTitle.set('Novo Capítulo')
        }
      }
    })
  }

  handleSave(): void {
    if (!this.chapterTitle().trim()) {
      this.showValidation.set(true)
      return
    }

    this.save.emit({
      title: this.chapterTitle().trim(),
      content: this.chapterContent().trim(),
    })

    // Reset validation after successful save
    this.showValidation.set(false)
  }

  handleCancel(): void {
    this.showValidation.set(false)
    this.cancelDialog.emit()
  }
}
