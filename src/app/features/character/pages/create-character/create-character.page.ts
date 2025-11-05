import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { Ancestry } from '@characters/interface/ancestry.model'
import { Class } from '@characters/interface/class.model'
import { AncestryService } from '@characters/services/ancestry.service'
import { ClassService } from '@characters/services/class.service'
import { SkillService } from '@characters/services/skill.service'
import { FormFactoryService } from '@characters/services/form-factory.service'
import { CharacterCreateHeaderComponent } from '@characters/components/character-create-header/character-create-header.component'
import { CharacterIdentityFormComponent } from '@characters/components/character-identity-form/character-identity-form.component'
import { CharacterAttributesFormComponent } from '@characters/components/character-attributes-form/character-attributes-form.component'
import { CharacterBackstoryFormComponent } from '@characters/components/character-backstory-form/character-backstory-form.component'
import { CharacterSheetPreviewComponent } from '@characters/components/character-sheet-preview/character-sheet-preview.component'
import { CharacterSkillsFormComponent } from '@characters/components/character-skills-form/character-skills-form.component'
import {
  CreateCharacterRequest,
  Modifiers,
} from '@characters/interface/character.model'
import { CharacterService } from '../../services/character.service'
import { CheckboxOption } from '@shared/components/checkbox/checkbox.component'
import { Toast } from 'primeng/toast'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'aso-create-character',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CharacterCreateHeaderComponent,
    CharacterIdentityFormComponent,
    CharacterAttributesFormComponent,
    CharacterBackstoryFormComponent,
    CharacterSheetPreviewComponent,
    Toast,
    CharacterSkillsFormComponent,
  ],
  templateUrl: './create-character.page.html',
  styleUrl: './create-character.page.scss',
  providers: [MessageService],
})
export class CreateCharacterPage implements OnInit {
  private readonly ancestryService = inject(AncestryService)
  private readonly classService = inject(ClassService)
  private readonly skillService = inject(SkillService)
  private readonly characterService = inject(CharacterService)
  private readonly formFactoryService = inject(FormFactoryService)
  private readonly router = inject(Router)
  private readonly messageService = inject(MessageService)

  @ViewChild('backstoryForm') backstoryForm!: CharacterBackstoryFormComponent

  ancestries: Ancestry[] = []
  classes: Class[] = []
  skills: CheckboxOption<string>[] = []
  loading = false
  formSubmitted = false
  isCreating = false

  protected readonly characterForm =
    this.formFactoryService.createCharacterForm()

  private readonly loadingText = 'Carregando...'

  ngOnInit(): void {
    this.initializeComponent()
  }

  get displayName(): string {
    return this.characterForm.get('name')?.value || '...'
  }
  get displayAncestry(): string {
    return (
      this.characterForm.get('ancestry')?.value ||
      this.getPlaceholder('Selecione uma Raça')
    )
  }
  get displayClass(): string {
    return (
      this.characterForm.get('charClass')?.value ||
      this.getPlaceholder('Selecione uma Classe')
    )
  }
  get displayCampaign(): string {
    return (
      this.characterForm.get('campaign')?.value ||
      this.getPlaceholder('Selecione uma Campanha')
    )
  }

  getPlaceholder(defaultText: string): string {
    return this.loading ? this.loadingText : defaultText
  }

  onReturnToList(): void {
    this.router.navigate(['/personagens'])
  }

  onGenerateRandomCharacter(): void {
    this.formFactoryService.onGenerateRandomCharacter(
      this.characterForm,
      this.ancestries,
      this.classes,
    )
    this.showInfoRandom()
  }

  onGenerateBackstory(): void {
    // A geração de backstory agora é handled diretamente pelo componente
    // Este método pode ser removido se não for mais necessário
  }

  onTriggerValidation(): void {
    this.formSubmitted = true
    this.scrollToTop()
  }

  onSaveCharacter(): void {
    this.formSubmitted = true
    console.log('Form Submitted:', this.characterForm.value)
    if (this.characterForm.valid) {
      const characterPayload: CreateCharacterRequest = this.createPayload()
      this.isCreating = true
      console.log('Creating character with payload:', characterPayload)
      this.characterService.createCharacter(characterPayload).subscribe({
        next: () => {
          this.showSuccess()
          this.characterForm.reset()
          this.formSubmitted = false
          this.router.navigate(['/personagens'], {
            queryParams: { success: 'character-created' },
          })
        },
        error: (error) => {
          console.error('Error creating character:', error)
          this.showError()
        },
        complete: () => {
          this.isCreating = false
        },
      })
    } else {
      this.scrollToTop()
      this.showError()
    }
  }

  onSubmit() {
    this.onSaveCharacter()
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Personagem Criado com sucesso!',
    })
  }
  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Ocorreu um erro ao criar o personagem. Tente novamente.',
    })
  }
  showInfoRandom() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Personagem randomicamente gerado.',
    })
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  private initializeComponent(): void {
    this.ancestryService.loadAncestries()
    this.classService.loadClasses()
    this.skillService.loadSkills()

    this.ancestryService.getAncestries$().subscribe((ancestries) => {
      this.ancestries = ancestries
    })

    this.classService.getClasses$().subscribe((classes) => {
      this.classes = classes
    })

    this.skillService.getSkills$().subscribe((skills) => {
      this.skills = (skills || []).map((skill) => ({
        label: skill.name,
        value: skill.id,
      }))
      console.log('Mapped skills for checkbox:', this.skills)
    })

    this.ancestryService.getLoading$().subscribe((loading) => {
      this.loading = loading
    })
  }

  private createPayload(): CreateCharacterRequest {
    return {
      name: this.characterForm.get('name')?.value,
      ancestryId: this.characterForm.get('ancestry')?.value.id,
      classId: this.characterForm.get('charClass')?.value.id,
      campaignId: this.characterForm.get('campaign')?.value?.id || null,
      attributes: this.characterForm.get('attributes')?.value || {},
      modifiers: this.getModifiers(),
      backstory: this.backstoryForm.getFinalBackstory(),
      skillsIds:
        this.characterForm
          .get('skills')
          ?.value.map((skill: { id: string; name: string }) => skill.id) || [],
      imageId: this.characterForm.get('image')?.value?.id || null,
    }
  }

  private getModifiers(): Modifiers {
    return {
      modStrength: this.getModAttribute('strength'),
      modDexterity: this.getModAttribute('dexterity'),
      modConstitution: this.getModAttribute('constitution'),
      modIntelligence: this.getModAttribute('intelligence'),
      modWisdom: this.getModAttribute('wisdom'),
      modCharisma: this.getModAttribute('charisma'),
    }
  }

  private getModAttribute(attributeName: string): number {
    const formPath = `attributes.${attributeName}`
    const attribute = this.characterForm.get(formPath)?.value || 0
    const mod = (attribute - 10) / 2

    return Math.floor(mod)
  }
}
