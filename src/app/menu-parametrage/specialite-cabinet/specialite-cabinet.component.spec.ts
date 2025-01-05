import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialiteCabinetComponent } from './specialite-cabinet.component';

describe('SpecialiteCabinetComponent', () => {
  let component: SpecialiteCabinetComponent;
  let fixture: ComponentFixture<SpecialiteCabinetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialiteCabinetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialiteCabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
