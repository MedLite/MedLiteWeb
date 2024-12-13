import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClotureSessionComponent } from './cloture-session.component';

describe('ClotureSessionComponent', () => {
  let component: ClotureSessionComponent;
  let fixture: ComponentFixture<ClotureSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClotureSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClotureSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
