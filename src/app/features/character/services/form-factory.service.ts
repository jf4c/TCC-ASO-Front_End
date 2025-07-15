import { inject, Injectable } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Ancestry } from '../interface/ancestry.model'
import { Class } from '../interface/class.model'

@Injectable({
  providedIn: 'root',
})
export class FormFactoryService {
  private formBuilder = inject(FormBuilder)
  private ancestries: Ancestry[] = []
  private classes: Class[] = []

  createCharacterForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      ancestry: [null, [Validators.required]],
      charClass: [null, [Validators.required]],
      campaign: [null],
      image: [null],
      attributes: this.formBuilder.group({
        strength: [10],
        dexterity: [10],
        constitution: [10],
        intelligence: [10],
        wisdom: [10],
        charisma: [10],
      }),
      backstory: [''],
      characterType: ['player', [Validators.required]],
      skills: [[], [Validators.required]],
    })
  }

  onGenerateRandomCharacter(
    characterForm: FormGroup,
    ancestries: Ancestry[],
    classes: Class[],
  ): void {
    characterForm.patchValue({
      name: this.onGenerateRandomName(),
      ancestry: this.getRandomItem(ancestries),
      charClass: this.getRandomItem(classes),
      image: this.getRandomCharacterImage(),
      // campaign: this.getRandomItem(this.campaigns),
      attributes: {
        strength: this.generateRandomAttributeValue(),
        dexterity: this.generateRandomAttributeValue(),
        constitution: this.generateRandomAttributeValue(),
        intelligence: this.generateRandomAttributeValue(),
        wisdom: this.generateRandomAttributeValue(),
        charisma: this.generateRandomAttributeValue(),
      },
      backstory: this.generateRandomBackstory(),
      characterType: 'player',
    })
  }

  onGenerateRandomName(): string {
    const names = [
      'Aragorn',
      'Legolas',
      'Gimli',
      'Frodo',
      'Samwise',
      'Gandalf',
      'Boromir',
      'Gollum',
      'Bilbo',
      'Thorin',
    ]
    return this.getRandomItem(names)
  }

  private getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }

  private generateRandomAttributeValue(): number {
    return Math.floor(Math.random() * 20) + 8
  }

  private generateRandomBackstory(): string {
    const backstories = [
      'Um aventureiro em busca de glória.',
      'Um herói em busca de redenção.',
      'Um explorador em terras desconhecidas.',
      'Um guerreiro em busca de vingança.',
      'Um mago em busca de conhecimento proibido.',
    ]
    return this.getRandomItem(backstories)
  }

  private getRandomCharacterImage(): string {
    const characterImages = [
      './assets/Character/assassin1.png',
      './assets/Character/assassin2.png',
      './assets/Character/bard.png',
      './assets/Character/bard2.png',
      './assets/Character/mage1.png',
      './assets/Character/mage2.png',
      './assets/Character/mage3.png',
      './assets/Character/mage4.png',
      './assets/Character/mage5.png',
      './assets/Character/mage6.png',
      './assets/Character/monk1.png',
      './assets/Character/orch.png',
      './assets/Character/orch1.png',
      './assets/Character/priest1.png',
      './assets/Character/priest2.png',
      './assets/Character/rogue1.png',
      './assets/Character/unknown.png',
      './assets/Character/warrior1.png',
      './assets/Character/warrior2.png',
      './assets/Character/warrior3.png',
      './assets/Character/warrior4.png',
    ]
    return this.getRandomItem(characterImages)
  }

  displayName(formGroup: FormGroup): string {
    return formGroup.get('name')?.value || '...'
  }
}
