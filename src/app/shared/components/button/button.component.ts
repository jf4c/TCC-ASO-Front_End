import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ButtonModule } from 'primeng/button'
import { UploadEvent } from 'primeng/fileupload'

@Component({
  selector: 'aso-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  // Propriedades de entrada
  @Input() label = ''
  @Input() size: 'small' | 'large' | undefined
  @Input() icon: string | undefined
  @Input() styleClass: object = {}
  @Input() variant: 'outlined' | 'text' | undefined
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

  // Propriedades de saída
  @Output() eventClick = new EventEmitter<MouseEvent>()
  @Output() UploadEvent = new EventEmitter<File>()

  // Métodos públicos (handlers)
  handleClick(event: MouseEvent) {
    this.eventClick.emit(event)
  }

  handleUpload(event: File) {
    this.UploadEvent.emit(event)
  }
}
