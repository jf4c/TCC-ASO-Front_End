import { Component, input, output, signal, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'

import { InputComponent } from '../../../../../shared/components/input/input.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { Act } from '../../../interfaces/act.interface'

export interface ActDialogData {
  act?: Act
  isEditing: boolean
}

@Component({
  selector: 'aso-act-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './act-dialog.component.html',
  styleUrl: './act-dialog.component.scss',
})
export class ActDialogComponent {
  visible = input.required<boolean>()
  data = input<ActDialogData | null>(null)

  save = output<{ title: string }>()
  cancelDialog = output<void>()

  actTitle = signal<string>('')
  showValidation = signal<boolean>(false)

  dialogTitle = signal<string>('')

  maxTitleLength = 200

  isValid = () => {
    const title = this.actTitle().trim()
    return title.length > 0 && title.length <= this.maxTitleLength
  }

  constructor() {
    // Efeito para atualizar os dados quando o dialog é aberto
    effect(() => {
      const dialogData = this.data()
      if (dialogData) {
        this.showValidation.set(false) // Reset validation
        if (dialogData.isEditing && dialogData.act) {
          // Modo de edição
          this.actTitle.set(dialogData.act.title)
          this.dialogTitle.set('Editar Ato')
        } else {
          // Modo de criação
          this.actTitle.set('')
          this.dialogTitle.set('Novo Ato')
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
      title: this.actTitle().trim(),
    })

    // Reset validation after successful save
    this.showValidation.set(false)
  }

  handleCancel(): void {
    this.showValidation.set(false)
    this.cancelDialog.emit()
  }

  getRemainingChars(): number {
    return this.maxTitleLength - this.actTitle().length
  }
}
