import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionERComponent } from './admission-er.component';

describe('AdmissionERComponent', () => {
  let component: AdmissionERComponent;
  let fixture: ComponentFixture<AdmissionERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmissionERComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
