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

@Component({
  selector: 'aso-character-identity-form',
  standalone: true,
  imports: [
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

  onGenerateRandomName(): void {
    this.generateRandomName.emit()
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
