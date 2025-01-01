import { TestBed } from '@angular/core/testing';

import { ParametargeService } from './parametarge.service';

describe('ParametargeService', () => {
  let service: ParametargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
