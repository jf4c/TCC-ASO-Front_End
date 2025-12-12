import { Component, inject, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
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
  private readonly router = inject(Router)
  
  @Input() character!: Character
  @Input() useDialog = false; // Se true, emite evento; se false, navega
  @Output() viewDetails = new EventEmitter<Character>();

  /**
   * Calcula HP total do personagem
   * HP Total = HP Inicial + modCON + [(HP por Nível + modCON) × (Nível - 1)]
   */
  getCalculatedHP(): number {
    const initialHp = this.character.class.initialHp;
    const hpPerLevel = this.character.class.hpPerLevel;
    const conMod = this.character.modifiers.constitution;
    const level = this.character.level;

    const result = initialHp + conMod + ((hpPerLevel + conMod) * (level - 1));
    
    console.log('🔍 CÁLCULO HP:', {
      personagem: this.character.name,
      initialHp,
      hpPerLevel,
      conMod,
      level,
      formula: `${initialHp} + ${conMod} + ((${hpPerLevel} + ${conMod}) × (${level} - 1))`,
      resultado: result
    });

    return result;
  }

  /**
   * Calcula MP total do personagem
   * MP Total = MP por Nível × Nível
   */
  getCalculatedMP(): number {
    const mpPerLevel = this.character.class.mpPerLevel;
    const level = this.character.level;

    const result = mpPerLevel * level;
    
    console.log('🔍 CÁLCULO MP:', {
      personagem: this.character.name,
      mpPerLevel,
      level,
      formula: `${mpPerLevel} × ${level}`,
      resultado: result
    });

    return result;
  }

  /**
   * Ao clicar em "Ver Detalhes"
   * - Se useDialog=true: emite evento para a página decidir (abrir dialog)
   * - Se useDialog=false: navega para página de detalhes
   */
  onViewDetails() {
    if (this.useDialog) {
      this.viewDetails.emit(this.character);
    } else {
      this.router.navigate(['/personagens', this.character.id]);
    }
  }
}
