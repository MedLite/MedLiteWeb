import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouvertureComponent } from './couverture.component';

describe('CouvertureComponent', () => {
  let component: CouvertureComponent;
  let fixture: ComponentFixture<CouvertureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CouvertureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouvertureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
