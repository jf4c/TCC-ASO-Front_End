import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricCardComponent } from './historic-card.component';

describe('HistoricCardComponent', () => {
  let component: HistoricCardComponent;
  let fixture: ComponentFixture<HistoricCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
