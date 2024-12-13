import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuReceptionComponent } from './menu-reception.component';

describe('MenuReceptionComponent', () => {
  let component: MenuReceptionComponent;
  let fixture: ComponentFixture<MenuReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuReceptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
