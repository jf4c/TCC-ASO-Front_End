import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'aso-button',
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label = ''
  @Input() size: 'small' | 'large' | undefined
  @Input() icon: string | undefined
  @Input() styleClass: object = {}
  @Input() severity:
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null
    | undefined

  @Output() eventClick = new EventEmitter<MouseEvent>()

  handleClick(event: MouseEvent) {
    this.eventClick.emit(event)
  }
}
