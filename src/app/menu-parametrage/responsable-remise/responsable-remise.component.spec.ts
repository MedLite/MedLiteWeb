import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableRemiseComponent } from './responsable-remise.component';

describe('ResponsableRemiseComponent', () => {
  let component: ResponsableRemiseComponent;
  let fixture: ComponentFixture<ResponsableRemiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsableRemiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableRemiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
