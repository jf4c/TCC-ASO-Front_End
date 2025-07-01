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
  @Output() delete = new EventEmitter<void>()

  onView() {
    console.log('View character:', this.character)
  }
  onEdit() {
    console.log('Edit character:', this.character)
  }
}
