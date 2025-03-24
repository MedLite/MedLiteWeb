import { TestBed } from '@angular/core/testing';

import { PatientSelectionService } from './patient-selected.service';

describe('PatientSelectedService', () => {
  let service: PatientSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
