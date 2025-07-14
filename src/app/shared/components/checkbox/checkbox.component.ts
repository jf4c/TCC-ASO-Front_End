import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'
import { CheckboxModule } from 'primeng/checkbox'

export interface CheckboxOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

@Component({
  selector: 'aso-checkbox',
  imports: [CommonModule, FormsModule, CheckboxModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent<T = string | number>
  implements ControlValueAccessor
{
  @Input() options: CheckboxOption<T>[] = []
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical'
  @Input() disabled = false
  @Output() selectionChange = new EventEmitter<T[]>()

  selectedValues: T[] = []

  // ControlValueAccessor implementation
  private onChange = (value: T[]): void => {
    // Callback will be set by registerOnChange
  }

  private onTouched = (): void => {
    // Callback will be set by registerOnTouched
  }

  writeValue(value: T[]): void {
    this.selectedValues = value || []
  }

  registerOnChange(fn: (value: T[]) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onSelectionChange(newSelection: T[]): void {
    this.selectedValues = newSelection
    this.onChange(this.selectedValues)
    this.onTouched()
    this.selectionChange.emit(this.selectedValues)
  }

  getInputId(option: CheckboxOption<T>, index: number): string {
    return `checkbox-${index}-${option.value}`
  }
}
