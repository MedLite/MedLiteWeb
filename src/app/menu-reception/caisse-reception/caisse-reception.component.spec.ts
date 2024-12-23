import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseReceptionComponent } from './caisse-reception.component';

describe('CaisseReceptionComponent', () => {
  let component: CaisseReceptionComponent;
  let fixture: ComponentFixture<CaisseReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaisseReceptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaisseReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
