import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuReceptionRoutingModule } from './menu-reception-routing.module';
import { MenuReceptionComponent } from './menu-reception.component'; 
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TagModule } from 'primeng/tag';
import { I18nPipeForMenuReception } from '../Shared/i18n/i18nForMenuReception.pipe'; 
import { AdmissionERComponent } from './admission-er/admission-er.component';
import { AdmissionIPComponent } from './admission-ip/admission-ip.component';
 

@NgModule({
  declarations: [
    MenuReceptionComponent, I18nPipeForMenuReception, AdmissionERComponent, AdmissionIPComponent
  ],
  imports: [
       CommonModule,TagModule,MatIconModule,MatMenuModule,
    MenuReceptionRoutingModule
  ], 
})
export class MenuReceptionModule { }
