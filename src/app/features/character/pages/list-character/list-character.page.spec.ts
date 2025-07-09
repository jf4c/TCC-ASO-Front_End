import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ListCharacterPage } from './list-character.page'

describe('ListCharacterPage', () => {
  let component: ListCharacterPage
  let fixture: ComponentFixture<ListCharacterPage>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCharacterPage],
    }).compileComponents()

    fixture = TestBed.createComponent(ListCharacterPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
