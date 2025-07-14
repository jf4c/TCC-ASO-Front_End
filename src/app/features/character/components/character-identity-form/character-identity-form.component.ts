import { Component, EventEmitter, Input, Output } from '@angular/core'
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
  ],
  templateUrl: './character-identity-form.component.html',
  styleUrl: './character-identity-form.component.scss',
})
export class CharacterIdentityFormComponent {
  @Input() characterForm!: FormGroup
  @Input() ancestries: Ancestry[] = []
  @Input() classes: Class[] = []
  @Input() loading = false
  @Input() formSubmitted = false

  characterImages: string[] = [
    './assets/Character/mage1.png',
    './assets/Character/mage2.png',
    './assets/Character/mage3.png',
  ]
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
    // TODO: Implementar seletor de imagens
    console.log('Image selector clicked')
    // Implementação temporária - selecionar primeira imagem
    this.characterForm.patchValue({
      image: this.characterImages[0],
    })
  }
}
