import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdmissionOPDComponent } from './list-admission-opd.component';

describe('ListAdmissionOPDComponent', () => {
  let component: ListAdmissionOPDComponent;
  let fixture: ComponentFixture<ListAdmissionOPDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAdmissionOPDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAdmissionOPDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
