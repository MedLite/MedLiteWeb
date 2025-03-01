import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleSoinComponent } from './feuille-soin.component';

describe('FeuilleSoinComponent', () => {
  let component: FeuilleSoinComponent;
  let fixture: ComponentFixture<FeuilleSoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeuilleSoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeuilleSoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
