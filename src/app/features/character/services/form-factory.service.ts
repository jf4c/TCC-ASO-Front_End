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
      name: ['', [Validators.required, Validators.minLength(3)]],
      ancestry: [null],
      charClass: [null],
      campaign: [null],
      attributes: this.formBuilder.group({
        strength: [10],
        dexterity: [10],
        constitution: [10],
        intelligence: [10],
        wisdom: [10],
        charisma: [10],
      }),
      backstory: [''],
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
    console.log('Available items:', items)
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

  displayName(formGroup: FormGroup): string {
    return formGroup.get('name')?.value || '...'
  }
}
