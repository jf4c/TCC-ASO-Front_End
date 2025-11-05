import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { CardComponent } from '@shared/components/card/card.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { InputComponent } from '@shared/components/input/input.component'
import { Ancestry } from '@characters/interface/ancestry.model'
import { Class } from '@characters/interface/class.model'
import { Message } from 'primeng/message'
import {
  RadioButtonComponent,
  RadioOption,
} from '@shared/components/radio-button/radio-button.component'
import { ButtonComponent } from '@app/shared/components/button/button.component'
import { Toast } from 'primeng/toast'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { CharacterDialogImageComponent } from '@characters/components/dialogs/character-dialog-image/character-dialog-image.component'
import { CharacterNamesService } from '@characters/services/character-names.service'
import { CharacterNamesResponse } from '@characters/interface/character-names.model'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'aso-character-identity-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    DropdownInputComponent,
    InputComponent,
    Message,
    RadioButtonComponent,
    ButtonComponent,
    Toast,
  ],
  templateUrl: './character-identity-form.component.html',
  styleUrl: './character-identity-form.component.scss',
  providers: [DialogService],
})
export class CharacterIdentityFormComponent {
  private readonly dialogService = inject(DialogService)
  private readonly characterNamesService = inject(CharacterNamesService)

  @Input() characterForm!: FormGroup
  @Input() ancestries: Ancestry[] = []
  @Input() classes: Class[] = []
  @Input() loading = false
  @Input() formSubmitted = false

  ref: DynamicDialogRef | undefined

  characterTypeOptions: RadioOption[] = [
    { key: 'player', value: 'player', name: 'Player' },
    { key: 'npc', value: 'npc', name: 'NPC' },
  ]

  @Output() generateRandomName = new EventEmitter<void>()

  generatedNames: CharacterNamesResponse | null = null
  isGeneratingNames = false

  onGenerateRandomName(): void {
    this.isGeneratingNames = true

    const ancestryId = this.characterForm.get('ancestry')?.value?.id
    const classId = this.characterForm.get('charClass')?.value?.id

    this.characterNamesService.generateNames(ancestryId, classId).subscribe({
      next: (response) => {
        this.generatedNames = response
        this.isGeneratingNames = false
      },
      error: (error) => {
        console.error('Erro ao gerar nomes:', error)
        this.isGeneratingNames = false
      },
    })
  }

  onSelectName(name: string): void {
    this.characterForm.patchValue({ name })
    this.generatedNames = null
  }

  getAllNames(): string[] {
    if (!this.generatedNames) return []
    return [...this.generatedNames.maleNames, ...this.generatedNames.femaleNames]
  }

  getPlaceholder(text: string): string {
    return this.loading ? 'Carregando...' : text
  }

  isInvalid(controlName: string): boolean {
    const control = this.characterForm.get(controlName)
    if (!control) return false
    return control.invalid && this.formSubmitted
  }

  selectedCharacterType: string | null = null

  ShowImageSelector() {
    this.ref = this.dialogService.open(CharacterDialogImageComponent, {
      header: 'Selecionar Imagem do Personagem',
      width: '30vw',
      modal: true,
      closable: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    })

    this.ref.onClose.subscribe((selectedImage: string | null) => {
      if (selectedImage) {
        this.characterForm.patchValue({ image: selectedImage })
      }
    })
  }
}
