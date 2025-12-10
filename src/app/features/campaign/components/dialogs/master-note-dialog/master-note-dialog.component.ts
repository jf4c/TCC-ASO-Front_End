import { Component, input, output, signal, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'

import { TextareaComponent } from '../../../../../shared/components/textarea/textarea.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { MasterNote } from '../../../interfaces/master-note.interface'

export interface MasterNoteDialogData {
  note?: MasterNote
  isEditing: boolean
}

@Component({
  selector: 'aso-master-note-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    TextareaComponent,
    ButtonComponent,
  ],
  templateUrl: './master-note-dialog.component.html',
  styleUrl: './master-note-dialog.component.scss',
})
export class MasterNoteDialogComponent {
  visible = input.required<boolean>()
  data = input<MasterNoteDialogData | null>(null)

  save = output<{ content: string }>()
  cancelDialog = output<void>()

  noteContent = signal<string>('')
  showValidation = signal<boolean>(false)

  dialogTitle = signal<string>('')

  isValid = () => {
    return this.noteContent().trim().length > 0
  }

  constructor() {
    // Efeito para atualizar os dados quando o dialog é aberto
    effect(() => {
      const dialogData = this.data()
      if (dialogData) {
        this.showValidation.set(false) // Reset validation
        if (dialogData.isEditing && dialogData.note) {
          // Modo de edição
          this.noteContent.set(dialogData.note.content)
          this.dialogTitle.set('Editar Nota do Mestre')
        } else {
          // Modo de criação
          this.noteContent.set('')
          this.dialogTitle.set('Nova Nota de Planejamento')
        }
      }
    })
  }

  handleSave(): void {
    if (!this.isValid()) {
      this.showValidation.set(true)
      return
    }

    this.save.emit({
      content: this.noteContent().trim(),
    })

    // Reset validation after successful save
    this.showValidation.set(false)
  }

  handleCancel(): void {
    this.showValidation.set(false)
    this.cancelDialog.emit()
  }
}
