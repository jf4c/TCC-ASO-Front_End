import { Component, forwardRef, Input } from '@angular/core'
import { Slider } from 'primeng/slider'
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'aso-slider',
  standalone: true,
  imports: [Slider, FormsModule, InputTextModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements ControlValueAccessor {
  @Input() value = 10
  @Input() label = ''
  isDisabled = false
  inputId = 'slider-input'

  onChange = (value: number) => {}
  onTouched = () => {}

  writeValue(value: number): void {
    this.value = value ?? 0
  }

  // Angular registra o callback de mudança
  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  // Angular registra o callback de toque
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  // Desabilita o controle
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  handleSliderChange(event: any): void {
    const value = event?.value ?? 0 // valor do slider
    this.value = Math.max(0, Math.min(20, value)) // limita o valor entre 0 e 20 (opcional)
    this.onChange(this.value) // avisa o Angular que o valor mudou
    this.onTouched() // avisa que o componente foi tocado
  }
}
