import { Component, Input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { SliderComponent } from '@shared/components/slider/slider.component'
import { CardComponent } from '@shared/components/card/card.component'

@Component({
  selector: 'aso-character-attributes-form',
  standalone: true,
  imports: [ReactiveFormsModule, SliderComponent, CardComponent],
  templateUrl: './character-attributes-form.component.html',
  styleUrls: ['./character-attributes-form.component.scss'],
})
export class CharacterAttributesFormComponent {
  @Input() characterForm!: FormGroup
}
