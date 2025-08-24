import { Component, Input } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'aso-feature-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
})
export class FeatureCardComponent {
  @Input() icon = ''
  @Input() title = ''
  @Input() description = ''
  @Input() route = ''
  @Input() RouterState = 'active'
}
