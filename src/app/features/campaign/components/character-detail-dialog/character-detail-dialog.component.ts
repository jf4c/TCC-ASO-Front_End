import { Component, input, output } from '@angular/core'
import { CharacterInCampaign } from '../../interfaces/campaign-detail.model'

@Component({
  selector: 'aso-character-detail-dialog',
  standalone: true,
  imports: [],
  templateUrl: './character-detail-dialog.component.html',
  styleUrl: './character-detail-dialog.component.scss',
})
export class CharacterDetailDialogComponent {
  character = input<CharacterInCampaign | null>(null)
  closeDialog = output<void>()

  onCloseDialog(): void {
    this.closeDialog.emit()
  }

  onBackdropClick(): void {
    this.closeDialog.emit()
  }

  onStopPropagation(event: Event): void {
    event.stopPropagation()
  }
}
