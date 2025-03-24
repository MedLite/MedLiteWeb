import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureMedecinComponent } from './signature-medecin.component';

describe('SignatureMedecinComponent', () => {
  let component: SignatureMedecinComponent;
  let fixture: ComponentFixture<SignatureMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignatureMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
