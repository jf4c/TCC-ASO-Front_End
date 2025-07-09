import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCreateHeaderComponent } from './character-create-header.component';

describe('CharacterCreateHeaderComponent', () => {
  let component: CharacterCreateHeaderComponent;
  let fixture: ComponentFixture<CharacterCreateHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCreateHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterCreateHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
