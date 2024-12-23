import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuReceptionRoutingModule } from './menu-reception-routing.module';
import { MenuReceptionComponent } from './menu-reception.component';
import { CaisseReceptionComponent } from './caisse-reception/caisse-reception.component';
 

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
