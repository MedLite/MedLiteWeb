import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionIPComponent } from './admission-ip.component';

describe('AdmissionIPComponent', () => {
  let component: AdmissionIPComponent;
  let fixture: ComponentFixture<AdmissionIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmissionIPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
