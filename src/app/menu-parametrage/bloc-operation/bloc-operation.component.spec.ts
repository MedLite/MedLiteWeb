import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocOperationComponent } from './bloc-operation.component';

describe('BlocOperationComponent', () => {
  let component: BlocOperationComponent;
  let fixture: ComponentFixture<BlocOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlocOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
