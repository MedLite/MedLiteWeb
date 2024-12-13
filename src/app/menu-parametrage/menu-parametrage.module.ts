import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuParametrageRoutingModule } from './menu-parametrage-routing.module';
import { MenuParametrageComponent } from './menu-parametrage.component';
import { BanqueComponent } from './banque/banque.component';
import { ResponsableRemiseComponent } from './responsable-remise/responsable-remise.component';
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
