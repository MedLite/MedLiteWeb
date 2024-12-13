import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuReceptionRoutingModule } from './menu-reception-routing.module';
import { MenuReceptionComponent } from './menu-reception.component';
import { AdmissionComponent } from './admission/admission.component'; 
import { EditionAdmissionComponent } from './edition-admission/edition-admission.component';


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
