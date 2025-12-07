import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
  computed,
} from '@angular/core'
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms'
import { BackstoryEditorComponent } from '@shared/components/backstory-editor/backstory-editor.component'
import { Skill } from '../../interface/skill.model'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'aso-character-backstory-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BackstoryEditorComponent,
  ],
  templateUrl: './character-backstory-form.component.html',
  styleUrl: './character-backstory-form.component.scss',
})
export class CharacterBackstoryFormComponent implements OnInit {
  @Input() characterForm!: FormGroup
  @Input() formSubmitted = false
  @Output() generateBackstory = new EventEmitter<void>()
  @Output() triggerValidation = new EventEmitter<void>()

  private readonly messageService = inject(MessageService)

  acceptedBackstory: string | null = null

  characterName = computed(() => this.characterForm.get('name')?.value || '');
  ancestryName = computed(() => this.characterForm.get('ancestry')?.value?.name || '');
  className = computed(() => this.characterForm.get('charClass')?.value?.name || '');
  
  attributes = computed(() => {
    const attrs = this.characterForm.get('attributes')?.value;
    return this.formatAttributes(attrs);
  });
  
  skills = computed(() => {
    const skillsValue = this.characterForm.get('skills')?.value;
    return this.formatSkills(skillsValue);
  });

  /**
   * Converte os atributos do formulário em string formatada
   * Exemplo: "Força: 15, Destreza: 14, Constituição: 13, Inteligência: 12, Sabedoria: 10, Carisma: 8"
   */
  private formatAttributes(attributes: Record<string, number>): string {
    if (!attributes) return ''

    const attributeLabels = {
      strength: 'Força',
      dexterity: 'Destreza',
      constitution: 'Constituição',
      intelligence: 'Inteligência',
      wisdom: 'Sabedoria',
      charisma: 'Carisma',
    }

    return Object.entries(attributes)
      .map(
        ([key, value]) =>
          `${attributeLabels[key as keyof typeof attributeLabels] || key}: ${value}`,
      )
      .join(', ')
  }

  /**
   * Converte o array de skills do formulário em string formatada
   * Exemplo: "Atletismo, Enganação, Furtividade"
   */
  private formatSkills(skills: Skill[]): string {
    if (!skills || !Array.isArray(skills)) return ''

    return skills
      .map((skill) => skill?.name || skill)
      .filter((name) => name)
      .join(', ')
  }

  ngOnInit(): void {
    // Componente simplificado - lógica movida para BackstoryEditorComponent
  }

  /**
   * Handler para mudança de backstory
   */
  onBackstoryChange(backstory: string): void {
    this.acceptedBackstory = backstory;
  }

  // Método para obter o backstory final para salvar no personagem
  getFinalBackstory(): string {
    return this.acceptedBackstory || ''
  }
}
