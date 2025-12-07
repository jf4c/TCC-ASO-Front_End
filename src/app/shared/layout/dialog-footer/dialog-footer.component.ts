import { Component, EventEmitter, Output, Input } from '@angular/core'
import { ButtonComponent } from '@shared/components/button/button.component'

@Component({
  selector: 'aso-dialog-footer',
  imports: [ButtonComponent],
  templateUrl: './dialog-footer.component.html',
  styleUrl: './dialog-footer.component.scss',
})
export class DialogFooterComponent {
  @Input() saveLabel = 'Salvar'
  @Input() saveIcon = 'fas fa-save'
  @Input() closeLabel = 'Fechar'
  @Input() closeIcon = 'fas fa-times'
  
  @Output() eventClose = new EventEmitter<void>()
  @Output() eventSave = new EventEmitter<void>()

  onClose(): void {
    this.eventClose.emit()
  }

  onSave(): void {
    this.eventSave.emit()
  }
}
