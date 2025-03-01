import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOPDComponent } from './request-opd.component';

describe('RequestOPDComponent', () => {
  let component: RequestOPDComponent;
  let fixture: ComponentFixture<RequestOPDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestOPDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestOPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
