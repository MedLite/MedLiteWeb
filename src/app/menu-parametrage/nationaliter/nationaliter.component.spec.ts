import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationaliterComponent } from './nationaliter.component';

describe('NationaliterComponent', () => {
  let component: NationaliterComponent;
  let fixture: ComponentFixture<NationaliterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NationaliterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationaliterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
