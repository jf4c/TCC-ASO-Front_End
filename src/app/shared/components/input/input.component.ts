import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { ButtonComponent } from '../button/button.component'
@Component({
  selector: 'aso-input',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonComponent,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() icon: string | null = null
  @Input() placeholder: string | null = null
  @Input() inputId: string | null = null
  @Input() label: string | null = null
  @Input() button = false
  @Input() buttonIcon: string | undefined
  @Input() variant: 'outlined' | 'text' | undefined
  @Input() isInvalid: boolean | undefined = false
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

  // @Input() label = ''
  // @Input() placeholder = ''

  value = ''
  isDisabled = false

  onChange = (value: string) => {}
  onTouched = () => {}

  writeValue(value: string): void {
    this.value = value ?? ''
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement
    const value = input?.value ?? ''
    this.value = value
    this.onChange(value)
    this.onTouched()
  }
  @Output() eventClick = new EventEmitter<MouseEvent>()

  handleClick(event: MouseEvent) {
    this.eventClick.emit(event)
  }
}
