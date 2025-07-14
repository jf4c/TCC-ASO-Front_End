import { Component, Input, OnInit } from '@angular/core'
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms'
import { CommonModule } from '@angular/common'
import {
  CheckboxComponent,
  CheckboxOption,
} from '@shared/components/checkbox/checkbox.component'
import { CardComponent } from '@shared/components/card/card.component'
import { Skill } from '@characters/interface/skill.model'

@Component({
  selector: 'aso-character-skills-form',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxComponent,
    CardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './character-skills-form.component.html',
  styleUrl: './character-skills-form.component.scss',
})
export class CharacterSkillsFormComponent implements OnInit {
  @Input() characterForm!: FormGroup
  @Input() formSubmitted = false
  @Input() skills: CheckboxOption<string>[] = []

  skillsFormControl = new FormControl<string[]>([])

  ngOnInit(): void {
    this.initializeSkillsControl()
    this.setupSkillsSync()
  }

  private initializeSkillsControl(): void {
    if (!this.characterForm.get('skills')) {
      this.characterForm.addControl('skills', new FormControl([]))
    }
  }

  private setupSkillsSync(): void {
    this.skillsFormControl.valueChanges.subscribe(
      (selectedIds: string[] | null) => {
        const selectedSkillObjects = (selectedIds || [])
          .map((skillId) =>
            this.skills.find((skill) => skill.value === skillId),
          )
          .filter((skill) => skill !== undefined)
          .map((skill) => ({
            id: skill!.value,
            name: skill!.label,
          }))

        const skillsControl = this.characterForm.get('skills')
        if (skillsControl) {
          skillsControl.setValue(selectedSkillObjects)
          skillsControl.markAsTouched()
        }
      },
    )
  }

  onClearSkills(): void {
    this.skillsFormControl.setValue([])
    this.skillsFormControl.markAsTouched()
  }

  get selectedSkills(): Skill[] {
    return this.characterForm.get('skills')?.value || []
  }

  getSelectedSkillIds(): string[] {
    return this.selectedSkills.map((skill) => skill.id)
  }

  isInvalid(): boolean {
    const skillsControl = this.characterForm.get('skills')
    return (
      this.formSubmitted &&
      (!skillsControl?.value ||
        !Array.isArray(skillsControl.value) ||
        skillsControl.value.length === 0)
    )
  }
}
