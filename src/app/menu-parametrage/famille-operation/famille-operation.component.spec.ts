import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleOperationComponent } from './famille-operation.component';

describe('FamilleOperationComponent', () => {
  let component: FamilleOperationComponent;
  let fixture: ComponentFixture<FamilleOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilleOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilleOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
