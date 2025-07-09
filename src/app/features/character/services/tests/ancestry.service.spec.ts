import { TestBed } from '@angular/core/testing';

import { AncestryService } from './ancestry.service';

describe('AncestryService', () => {
  let service: AncestryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AncestryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
