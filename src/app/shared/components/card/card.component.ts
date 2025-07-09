import { Component, Input } from '@angular/core'

@Component({
  selector: 'aso-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() header = false
}
