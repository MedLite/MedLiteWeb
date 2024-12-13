import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionAdmissionComponent } from './edition-admission.component';

describe('EditionAdmissionComponent', () => {
  let component: EditionAdmissionComponent;
  let fixture: ComponentFixture<EditionAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditionAdmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
