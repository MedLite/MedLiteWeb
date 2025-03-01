import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierMedicalIPComponent } from './dossier-medical-ip.component';

describe('DossierMedicalIPComponent', () => {
  let component: DossierMedicalIPComponent;
  let fixture: ComponentFixture<DossierMedicalIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DossierMedicalIPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierMedicalIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
