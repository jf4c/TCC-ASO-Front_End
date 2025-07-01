import { Component, Input } from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'

@Component({
  selector: 'aso-input',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  text1 = ''
  @Input() icon: string | null = null
  @Input() placeholder: string | null = null
}
