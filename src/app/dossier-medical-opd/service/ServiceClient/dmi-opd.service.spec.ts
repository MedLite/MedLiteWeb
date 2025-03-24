import { TestBed } from '@angular/core/testing';

import { DmiOpdService } from './dmi-opd.service';

describe('DmiOpdService', () => {
  let service: DmiOpdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmiOpdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
