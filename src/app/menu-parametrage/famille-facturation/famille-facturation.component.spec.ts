import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilleFacturationComponent } from './famille-facturation.component';

describe('FamilleFacturationComponent', () => {
  let component: FamilleFacturationComponent;
  let fixture: ComponentFixture<FamilleFacturationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilleFacturationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilleFacturationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
