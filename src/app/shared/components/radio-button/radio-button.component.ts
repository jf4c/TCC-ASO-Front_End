import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RadioButtonModule } from 'primeng/radiobutton'

export interface RadioOption {
  key: string
  value: string | number | boolean
  name: string
  disabled?: boolean
}

@Component({
  selector: 'aso-radio-button',
  standalone: true,
  imports: [RadioButtonModule, CommonModule, FormsModule],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent implements ControlValueAccessor {
  @Input() options: RadioOption[] = []
  @Input() name = ''
  @Input() label = ''
  @Input() required = false
  @Input() disabled = false
  @Input() styleClass = ''

  @Output() selectionChange = new EventEmitter<string | number | boolean>()

  selectedValue: string | number | boolean | null = null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_value: string | number | boolean | null): void => {
    // This will be overridden by registerOnChange
  }

  private onTouched = (): void => {
    // This will be overridden by registerOnTouched
  }

  writeValue(value: string | number | boolean | null): void {
    this.selectedValue = value
  }

  registerOnChange(
    fn: (value: string | number | boolean | null) => void,
  ): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onSelectionChange(value: string | number | boolean): void {
    this.selectedValue = value
    this.onChange(value)
    this.onTouched()
    this.selectionChange.emit(value)
  }
}
