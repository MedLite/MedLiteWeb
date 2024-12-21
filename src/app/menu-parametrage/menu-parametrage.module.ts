import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuParametrageRoutingModule } from './menu-parametrage-routing.module';
import { MenuParametrageComponent } from './menu-parametrage.component'; 
import { TagModule } from 'primeng/tag';
import {MatIconModule} from '@angular/material/icon';

import {MatMenuModule} from '@angular/material/menu';
@NgModule({
  declarations: [
    MenuParametrageComponent,
  
  ],
  imports: [
    CommonModule,TagModule,MatIconModule,MatMenuModule,
    MenuParametrageRoutingModule
  ],
  
})
export class MenuParametrageModule { }
