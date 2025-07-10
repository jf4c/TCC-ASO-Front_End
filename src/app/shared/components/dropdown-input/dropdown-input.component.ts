import { Component, Input, forwardRef } from '@angular/core'
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'
import { Ancestry } from '@app/features/character/interface/ancestry.model'
import { SelectModule } from 'primeng/select'

@Component({
  selector: 'aso-dropdown-input',
  standalone: true,
  imports: [FormsModule, SelectModule],
  templateUrl: './dropdown-input.component.html',
  styleUrl: './dropdown-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownInputComponent),
      multi: true,
    },
  ],
})
export class DropdownInputComponent implements ControlValueAccessor {
  @Input() options: Ancestry[] = []
  @Input() placeholder = ''
  @Input() optionLabel = ''
  @Input() filter = false
  @Input() filterBy = ''
  @Input() showClear = false
  @Input() styleClass: object = {}
  @Input() label: string | null = null
  @Input() inputId = 'dropdown-input'
  @Input() loading = false
  @Input() isInvalid = false

  value: Ancestry | null = null
  isDisabled = false

  onChange: (value: Ancestry | null) => void = () => {
    // Callback function for Angular forms
  }
  onTouched = () => {
    // Callback function for Angular forms
  }

  writeValue(value: Ancestry | null): void {
    this.value = value
  }

  registerOnChange(fn: (value: Ancestry | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  handleSelectionChange(value: Ancestry | null): void {
    this.value = value
    this.onChange(this.value)
    this.onTouched()
  }
}
