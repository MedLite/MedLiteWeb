import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierMedicalOPDComponent } from './dossier-medical-opd.component';

describe('DossierMedicalOPDComponent', () => {
  let component: DossierMedicalOPDComponent;
  let fixture: ComponentFixture<DossierMedicalOPDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DossierMedicalOPDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierMedicalOPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
