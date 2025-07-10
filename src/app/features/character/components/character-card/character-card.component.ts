import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Character } from '@features/character/interface/character.model'
import { ButtonComponent } from '@shared/components/button/button.component'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'aso-character-card',
  standalone: true,
  imports: [ButtonModule, CommonModule, ButtonComponent],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss',
})
export class CharacterCardComponent {
  @Input() character!: Character

  @Output() edit = new EventEmitter<void>()
  @Output() view = new EventEmitter<void>()

  onView() {
    this.view.emit()
  }
  onEdit() {
    this.edit.emit()
  }
}
