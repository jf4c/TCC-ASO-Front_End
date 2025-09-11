import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
} from '@angular/core'
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms'
import { ButtonComponent } from '@shared/components/button/button.component'
import { CardComponent } from '@shared/components/card/card.component'
import { TextareaComponent } from '@shared/components/textarea/textarea.component'
import { BackstoryService } from '../../services/backstory.service'
import { CharacterBackstoryRequest } from '../../interface/backstory.model'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'aso-character-backstory-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    TextareaComponent,
  ],
  templateUrl: './character-backstory-form.component.html',
  styleUrl: './character-backstory-form.component.scss',
})
export class CharacterBackstoryFormComponent implements OnInit {
  @Input() characterForm!: FormGroup
  @Input() formSubmitted = false
  @Output() generateBackstory = new EventEmitter<void>()
  @Output() triggerValidation = new EventEmitter<void>()

  private readonly backstoryService = inject(BackstoryService)
  private readonly messageService = inject(MessageService)

  isGenerating = false
  generatedBackstory: string | null = null
  backstoryAccepted = false
  acceptedBackstory: string | null = null
  errorMessage = ''
  isEditingBackstory = false
  editBackstoryControl = new FormControl('')
  hasTriedToGenerate = false

  manualBackstoryControl = new FormControl('')

  ngOnInit(): void {
    // Observa mudanças no formulário para reabilitar o botão quando campos são preenchidos
    this.characterForm.valueChanges.subscribe(() => {
      // Reset da flag quando os campos obrigatórios são preenchidos após uma tentativa falhada
      if (this.hasTriedToGenerate && this.canGenerate()) {
        this.hasTriedToGenerate = false
      }
    })
  }

  onGenerateBackstory(): void {
    this.hasTriedToGenerate = true

    // Verifica se os campos obrigatórios estão preenchidos
    if (!this.canGenerate()) {
      this.triggerValidation.emit()
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obrigatórios',
        detail: 'Preencha o nome, raça e classe antes de gerar a história.',
      })
      return
    }

    this.isGenerating = true
    this.errorMessage = ''
    this.backstoryAccepted = false

    const formValue = this.characterForm.value
    const request: CharacterBackstoryRequest = {
      name: formValue.name || '',
      ancestry: formValue.ancestry?.name || '',
      class: formValue.charClass?.name || '',
      supplements: this.manualBackstoryControl.value || '',
    }

    this.backstoryService.generateBackstory(request).subscribe({
      next: (response) => {
        this.generatedBackstory = response.text
        console.log(request)
        this.isGenerating = false
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'História gerada com sucesso! Revise e confirme.',
        })
      },
      error: (error) => {
        this.isGenerating = false
        this.errorMessage = 'Erro ao gerar história. Tente novamente.'
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível gerar a história. Verifique sua conexão.',
        })
        console.error('Erro ao gerar backstory:', error)
      },
    })
  }

  onAcceptBackstory(): void {
    if (this.generatedBackstory) {
      // Salva o backstory aceito separadamente do form
      this.acceptedBackstory = this.generatedBackstory
      this.backstoryAccepted = true
      // Limpa o textarea que foi usado como supplements
      this.manualBackstoryControl.setValue('')
      this.messageService.add({
        severity: 'success',
        summary: 'História Aceita',
        detail: 'A história foi salva para o seu personagem.',
      })
    }
  }

  onAcceptManualBackstory(): void {
    const manualText = this.manualBackstoryControl.value?.trim()
    if (manualText) {
      // Salva o texto manual como backstory aceito
      this.acceptedBackstory = manualText
      this.backstoryAccepted = true
      this.generatedBackstory = manualText // Para mostrar no preview
      // Limpa o textarea após aceitar
      this.manualBackstoryControl.setValue('')
      this.messageService.add({
        severity: 'success',
        summary: 'História Manual Aceita',
        detail: 'Sua história foi salva para o personagem.',
      })
    }
  }

  hasManualText(): boolean {
    return !!this.manualBackstoryControl.value?.trim()
  }

  onDiscardBackstory(): void {
    this.generatedBackstory = null
    this.backstoryAccepted = false
    this.acceptedBackstory = null
    this.isEditingBackstory = false
    this.messageService.add({
      severity: 'info',
      summary: 'História Descartada',
      detail: 'Você pode gerar uma nova história quando quiser.',
    })
  }

  onEditBackstory(): void {
    this.isEditingBackstory = true
    this.editBackstoryControl.setValue(this.acceptedBackstory || '')
  }

  onSaveEditBackstory(): void {
    const editedText = this.editBackstoryControl.value || ''
    this.acceptedBackstory = editedText
    this.generatedBackstory = editedText
    this.isEditingBackstory = false
    this.messageService.add({
      severity: 'success',
      summary: 'História Editada',
      detail: 'As alterações foram salvas.',
    })
  }

  onCancelEditBackstory(): void {
    this.isEditingBackstory = false
    this.editBackstoryControl.setValue('')
  }

  onDeleteBackstory(): void {
    this.generatedBackstory = null
    this.backstoryAccepted = false
    this.acceptedBackstory = null
    this.isEditingBackstory = false
    this.messageService.add({
      severity: 'info',
      summary: 'História Excluída',
      detail: 'A história foi removida.',
    })
  }

  // Método para obter o backstory final para salvar no personagem
  getFinalBackstory(): string {
    return this.acceptedBackstory || ''
  }

  canGenerate(): boolean {
    const formValue = this.characterForm.value
    return !!(
      formValue.name?.trim() &&
      formValue.ancestry?.name &&
      formValue.charClass?.name
    )
  }

  isGenerateButtonDisabled(): boolean {
    return this.isGenerating || (this.hasTriedToGenerate && !this.canGenerate())
  }
}
