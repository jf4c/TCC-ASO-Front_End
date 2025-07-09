import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { CardComponent } from '@shared/components/card/card.component'
import { DropdownInputComponent } from '@shared/components/dropdown-input/dropdown-input.component'
import { InputComponent } from '@shared/components/input/input.component'
import { Ancestry } from '@characters/interface/ancestry.model'
import { Class } from '@characters/interface/class.model'

@Component({
  selector: 'aso-character-identity-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    DropdownInputComponent,
    InputComponent,
  ],
  templateUrl: './character-identity-form.component.html',
  styleUrl: './character-identity-form.component.scss',
})
export class CharacterIdentityFormComponent {
  @Input() characterForm!: FormGroup
  @Input() ancestries: Ancestry[] = []
  @Input() classes: Class[] = []
  @Input() loading = false

  @Output() generateRandomName = new EventEmitter<void>()

  onGenerateRandomName(): void {
    this.generateRandomName.emit()
  }

  getPlaceholder(text: string): string {
    return this.loading ? 'Carregando...' : text
  }
}
