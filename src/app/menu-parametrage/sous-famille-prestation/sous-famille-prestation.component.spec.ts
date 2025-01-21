import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousFamillePrestationComponent } from './sous-famille-prestation.component';

describe('SousFamillePrestationComponent', () => {
  let component: SousFamillePrestationComponent;
  let fixture: ComponentFixture<SousFamillePrestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SousFamillePrestationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousFamillePrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
