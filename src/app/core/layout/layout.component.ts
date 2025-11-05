import { Component } from '@angular/core'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'

@Component({
  selector: 'aso-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
