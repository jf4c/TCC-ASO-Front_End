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
