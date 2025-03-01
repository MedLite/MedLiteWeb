import { TestBed } from '@angular/core/testing';

import { PatientSelectedService } from './patient-selected.service';

describe('PatientSelectedService', () => {
  let service: PatientSelectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientSelectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
