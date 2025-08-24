import { Component, Input } from '@angular/core'

@Component({
  selector: 'aso-historic-card',
  imports: [],
  templateUrl: './historic-card.component.html',
  styleUrl: './historic-card.component.scss',
})
export class HistoricCardComponent {
  @Input() title = ''
  @Input() description = ''
  @Input() date = ''
}
