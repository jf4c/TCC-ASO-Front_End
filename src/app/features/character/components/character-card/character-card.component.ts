import { Component, inject, Input } from '@angular/core'
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

  /**
   * Navega para tela de detalhes do personagem
   */
  onViewDetails() {
    this.router.navigate(['/personagens', this.character.id])
  }
}
