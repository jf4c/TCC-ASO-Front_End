import { inject, Injectable } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Ancestry } from '../interface/ancestry.model'
import { Class } from '../interface/class.model'

@Injectable({
  providedIn: 'root',
})
export class FormFactoryService {
  private formBuilder = inject(FormBuilder)

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
    const balancedAttributes = this.generateBalancedAttributes();
    
    characterForm.patchValue({
      name: this.onGenerateRandomName(),
      ancestry: this.getRandomItem(ancestries),
      charClass: this.getRandomItem(classes),
      // image: this.getRandomCharacterImage(),
      // campaign: this.getRandomItem(this.campaigns),
      attributes: balancedAttributes,
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

  /**
   * Gera atributos balanceados seguindo as regras:
   * 1. Cada atributo entre 3 e 18
   * 2. Soma dos modificadores >= +6
   * 3. Soma total <= 78 (média 13)
   */
  private generateBalancedAttributes(): {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  } {
    const MAX_ATTEMPTS = 1000;
    let attempts = 0;
    
    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      
      // Gera valores aleatórios entre 3 e 18
      const attributes = {
        strength: this.randomBetween(3, 18),
        dexterity: this.randomBetween(3, 18),
        constitution: this.randomBetween(3, 18),
        intelligence: this.randomBetween(3, 18),
        wisdom: this.randomBetween(3, 18),
        charisma: this.randomBetween(3, 18),
      };
      
      // Calcula soma total
      const total = Object.values(attributes).reduce((sum, val) => sum + val, 0);
      
      // Calcula soma dos modificadores (modificador = floor((atributo - 10) / 2))
      const modifierSum = Object.values(attributes).reduce((sum, val) => {
        return sum + Math.floor((val - 10) / 2);
      }, 0);
      
      // Verifica se atende às regras
      if (total <= 78 && modifierSum >= 6) {
        return attributes;
      }
    }
    
    // Fallback: gera um set garantido que atende as regras
    // Distribui 78 pontos com pelo menos 3 em cada atributo
    return {
      strength: 13,
      dexterity: 13,
      constitution: 13,
      intelligence: 13,
      wisdom: 13,
      charisma: 13,
    };
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
