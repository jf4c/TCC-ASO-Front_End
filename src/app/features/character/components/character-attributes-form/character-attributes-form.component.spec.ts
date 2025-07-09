import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CharacterAttributesFormComponent } from './character-attributes-form.component'

describe('CharacterAttributesFormComponent', () => {
  let component: CharacterAttributesFormComponent
  let fixture: ComponentFixture<CharacterAttributesFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterAttributesFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CharacterAttributesFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
