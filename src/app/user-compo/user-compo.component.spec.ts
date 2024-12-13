import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompoComponent } from './user-compo.component';

describe('UserCompoComponent', () => {
  let component: UserCompoComponent;
  let fixture: ComponentFixture<UserCompoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCompoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCompoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
