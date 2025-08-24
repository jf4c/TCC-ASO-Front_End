import { inject, Injectable } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Injectable({
  providedIn: 'root',
})
export class FilterFormFactoryService {
  private formBuilder = inject(FormBuilder)

  createFilterForm(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      class: [null],
      ancestry: [null],
      campaign: [null],
    })
  }
}
