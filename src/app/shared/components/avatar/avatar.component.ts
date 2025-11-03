import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'aso-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() src?: string | null = null
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'sm'
  @Input() alt: string = 'User avatar'
  @Input() fallback: string = '👤'

  @Output() avatarClick = new EventEmitter<MouseEvent>()

  imageError = false

  onImageError() {
    this.imageError = true
  }

  onClick(event: MouseEvent) {
    this.avatarClick.emit(event)
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.avatarClick.emit(event as any)
    }
  }
}
