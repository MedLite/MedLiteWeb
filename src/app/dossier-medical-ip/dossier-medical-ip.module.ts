import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DossierMedicalIPRoutingModule } from './dossier-medical-ip-routing.module';
import { DossierMedicalIPComponent } from './dossier-medical-ip.component';


@NgModule({
  declarations: [
    DossierMedicalIPComponent
  ],
  imports: [
    CommonModule,
    DossierMedicalIPRoutingModule
  ]
})
export class DossierMedicalIPModule { }
