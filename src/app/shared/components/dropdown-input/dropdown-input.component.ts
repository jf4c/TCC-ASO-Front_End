import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Ancestry } from '@app/features/character/interface/ancestry.model'
import { SelectModule } from 'primeng/select'

@Component({
  selector: 'aso-dropdown-input',
  standalone: true,
  imports: [FormsModule, SelectModule],
  templateUrl: './dropdown-input.component.html',
  styleUrl: './dropdown-input.component.scss',
})
export class DropdownInputComponent {
  @Input() options: Ancestry[] = []
  @Input() placeholder = ''
  @Input() optionLabel = ''
  @Input() filter = false
  @Input() filterBy = ''
  @Input() showClear = false
  @Input() styleClass: object = {}
}
