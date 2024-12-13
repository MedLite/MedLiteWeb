import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningMedecinComponent } from './planning-medecin.component';

describe('PlanningMedecinComponent', () => {
  let component: PlanningMedecinComponent;
  let fixture: ComponentFixture<PlanningMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
