import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { CardComponent } from '@shared/components/card/card.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { InputComponent } from '@shared/components/input/input.component'
import { Ancestry } from '@characters/interface/ancestry.model'
import { Class } from '@characters/interface/class.model'
import { Message } from 'primeng/message'

@Component({
  selector: 'aso-character-identity-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    DropdownInputComponent,
    InputComponent,
    Message,
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
}
