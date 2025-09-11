import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'aso-textarea',
  imports: [],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder = 'Escreva aqui a descrição do personagem...'
  @Input() style: object = { height: '200px' }
  value = ''

  onChange = (value: any) => {}
  onTouched = () => {}

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  // Exemplo de chamada ao mudar valor no input
  onInputChange(event: Event) {
    const newValue = (event.target as HTMLTextAreaElement).value
    this.value = newValue
    this.onChange(newValue)
    this.onTouched()
  }
}
