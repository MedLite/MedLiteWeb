import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuReceptionRoutingModule } from './menu-reception-routing.module';
import { MenuReceptionComponent } from './menu-reception.component';
 

@NgModule({
  declarations: [
    MenuReceptionComponent, 
  ],
  imports: [
    CommonModule,
    MenuReceptionRoutingModule
  ]
})
export class MenuReceptionModule { }
