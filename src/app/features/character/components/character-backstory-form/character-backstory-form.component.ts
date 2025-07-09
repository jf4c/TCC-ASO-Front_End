import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonComponent } from '@shared/components/button/button.component'
import { CardComponent } from '@shared/components/card/card.component'
import { TextareaComponent } from '@shared/components/textarea/textarea.component'

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
export class CharacterBackstoryFormComponent {
  @Input() characterForm!: FormGroup

  @Output() generateBackstory = new EventEmitter<void>()

  onGenerateBackstory(): void {
    this.generateBackstory.emit()
  }
}
