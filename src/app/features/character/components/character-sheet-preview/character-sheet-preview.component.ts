import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ButtonComponent } from '@shared/components/button/button.component'
import { CardComponent } from '@shared/components/card/card.component'

@Component({
  selector: 'aso-character-sheet-preview',
  standalone: true,
  imports: [ButtonComponent, CardComponent],
  templateUrl: './character-sheet-preview.component.html',
  styleUrl: './character-sheet-preview.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CharacterSheetPreviewComponent {
  @Input() characterForm!: FormGroup
  @Input() displayName!: string
  @Input() displayAncestry!: string
  @Input() displayClass!: string

  @Output() saveCharacter = new EventEmitter<void>()

  onSaveCharacter(): void {
    this.saveCharacter.emit()
  }

  getAttributeModifier(attributeName: string): number {
    const attribute =
      this.characterForm.get(`attributes.${attributeName}`)?.value || 0
    const mod = (attribute - 10) / 2
    return Math.floor(mod)
  }
}
