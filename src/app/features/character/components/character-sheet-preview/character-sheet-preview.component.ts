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

  getCharacterName(): string {
    return this.characterForm.get('name')?.value || '...'
  }

  getAncestryAndClass(): string {
    const ancestry = this.getAncestry()
    const charClass = this.getClass()

    const ancestryWithEmoji = ancestry ? `🧬 ${ancestry}` : ''
    const classWithEmoji = charClass ? `⚔️ ${charClass}` : ''

    return `${ancestryWithEmoji}${ancestryWithEmoji && classWithEmoji ? ' | ' : ''}${classWithEmoji}`
  }

  getAncestry(): string {
    return this.characterForm.get('ancestry')?.value?.name || ''
  }

  getClass(): string {
    return this.characterForm.get('charClass')?.value?.name || ''
  }

  getBackstory(): string {
    return this.characterForm.get('backstory')?.value || ''
  }

  getSkills(): string[] {
    const skills = this.characterForm.get('skills')?.value || []

    if (Array.isArray(skills)) {
      return skills
        .filter((skill) => skill && skill.name)
        .map((skill: { name: string }) => skill.name)
    }

    return []
  }

  getSkillsDisplay(): string {
    const skillNames = this.getSkills()
    return skillNames.length > 0
      ? skillNames.join(', ')
      : 'Nenhuma perícia selecionada'
  }
}
