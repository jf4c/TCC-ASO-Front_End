import { Component } from '@angular/core'
import { HistoricCardComponent } from './components/historic-card/historic-card.component'
import { FeatureCardComponent } from './components/feature-card/feature-card.component'

@Component({
  selector: 'aso-home',
  imports: [FeatureCardComponent, HistoricCardComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
