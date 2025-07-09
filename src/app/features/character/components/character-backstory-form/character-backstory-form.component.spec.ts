import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CharacterBackstoryFormComponent } from './character-backstory-form.component'

describe('CharacterBackstoryFormComponent', () => {
  let component: CharacterBackstoryFormComponent
  let fixture: ComponentFixture<CharacterBackstoryFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterBackstoryFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CharacterBackstoryFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
