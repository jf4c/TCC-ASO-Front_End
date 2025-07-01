import { Component } from '@angular/core'
import { HeaderComponent } from './components/header/header.component'

@Component({
  selector: 'aso-layout',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
