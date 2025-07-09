import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { Ancestry } from '@characters/interface/ancestry.model'
import { Class } from '@characters/interface/class.model'
import { AncestryService } from '@characters/services/ancestry.service'
import { ClassService } from '@characters/services/class.service'
import { FormFactoryService } from '@characters/services/form-factory.service'
import { CharacterCreateHeaderComponent } from '@characters/components/character-create-header/character-create-header.component'
import { CharacterIdentityFormComponent } from '@characters/components/character-identity-form/character-identity-form.component'
import { CharacterAttributesFormComponent } from '@characters/components/character-attributes-form/character-attributes-form.component'
import { CharacterBackstoryFormComponent } from '@characters/components/character-backstory-form/character-backstory-form.component'
import { CharacterSheetPreviewComponent } from '@characters/components/character-sheet-preview/character-sheet-preview.component'

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
  ],
  templateUrl: './create-character.page.html',
  styleUrl: './create-character.page.scss',
})
export class CreateCharacterPage implements OnInit {
  private readonly ancestryService = inject(AncestryService)
  private readonly classService = inject(ClassService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly formFactoryService = inject(FormFactoryService)
  private readonly router = inject(Router)

  ancestries: Ancestry[] = []
  classes: Class[] = []
  loading = false

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
  }

  onGenerateRandomName(): void {
    this.characterForm.patchValue({
      name: this.formFactoryService.onGenerateRandomName(),
    })
  }

  onGenerateBackstory(): void {
    // TODO: Implementar geração de backstory por IA
    console.log('Generate backstory clicked')
  }

  onSaveCharacter(): void {
    console.log('Character saved:', this.characterForm.value)
  }

  private initializeComponent(): void {
    this.ancestryService.loadAncestries()
    this.classService.loadClasses()

    this.ancestryService.getAncestries$().subscribe((ancestries) => {
      this.ancestries = ancestries
    })

    this.classService.getClasses$().subscribe((classes) => {
      this.classes = classes
    })

    this.ancestryService.getLoading$().subscribe((loading) => {
      this.loading = loading
    })
  }
}
