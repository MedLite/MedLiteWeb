import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuParametrageComponent } from './menu-parametrage.component';

describe('MenuParametrageComponent', () => {
  let component: MenuParametrageComponent;
  let fixture: ComponentFixture<MenuParametrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuParametrageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuParametrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
