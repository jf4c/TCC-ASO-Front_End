import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CharacterSheetPreviewComponent } from './character-sheet-preview.component'

describe('CharacterSheetPreviewComponent', () => {
  let component: CharacterSheetPreviewComponent
  let fixture: ComponentFixture<CharacterSheetPreviewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterSheetPreviewComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CharacterSheetPreviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
