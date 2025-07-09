import { Component, EventEmitter, Output } from '@angular/core'
import { ButtonComponent } from '@shared/components/button/button.component'

@Component({
  selector: 'aso-character-create-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './character-create-header.component.html',
  styleUrl: './character-create-header.component.scss',
})
export class CharacterCreateHeaderComponent {
  @Output() returnToList = new EventEmitter<void>()
  @Output() generateRandomCharacter = new EventEmitter<void>()

  onReturnToList(): void {
    this.returnToList.emit()
  }

  onGenerateRandomCharacter(): void {
    this.generateRandomCharacter.emit()
  }
}
