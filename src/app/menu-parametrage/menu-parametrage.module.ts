import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuParametrageRoutingModule } from './menu-parametrage-routing.module';
import { MenuParametrageComponent } from './menu-parametrage.component'; 
import { TagModule } from 'primeng/tag'; 


@NgModule({
  declarations: [
    MenuParametrageComponent, 
  
  ],
  imports: [
    CommonModule,TagModule,
    MenuParametrageRoutingModule
  ],
  
})
export class MenuParametrageModule { }
