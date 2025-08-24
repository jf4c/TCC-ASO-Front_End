import { TestBed } from '@angular/core/testing';

import { FilterFormFactoryService } from './filter-form-factory.service';

describe('FilterFormFactoryService', () => {
  let service: FilterFormFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterFormFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
