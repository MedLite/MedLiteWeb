import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionOPDComponent } from './prescription-opd.component';

describe('PrescriptionOPDComponent', () => {
  let component: PrescriptionOPDComponent;
  let fixture: ComponentFixture<PrescriptionOPDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionOPDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionOPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
