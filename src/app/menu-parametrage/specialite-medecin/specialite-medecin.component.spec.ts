import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialiteMedecinComponent } from './specialite-medecin.component';

describe('SpecialiteMedecinComponent', () => {
  let component: SpecialiteMedecinComponent;
  let fixture: ComponentFixture<SpecialiteMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialiteMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialiteMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
