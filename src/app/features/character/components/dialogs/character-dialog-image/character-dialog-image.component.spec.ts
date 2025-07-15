import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterDialogImageComponent } from './character-dialog-image.component';

describe('CharacterDialogImageComponent', () => {
  let component: CharacterDialogImageComponent;
  let fixture: ComponentFixture<CharacterDialogImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterDialogImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterDialogImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
