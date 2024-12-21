import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamillePrestationComponent } from './famille-prestation.component';

describe('FamillePrestationComponent', () => {
  let component: FamillePrestationComponent;
  let fixture: ComponentFixture<FamillePrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamillePrestationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamillePrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
