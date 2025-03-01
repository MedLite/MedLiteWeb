import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DossierMedicalOPDRoutingModule } from './dossier-medical-opd-routing.module';
import { DossierMedicalOPDComponent } from './dossier-medical-opd.component';
 
 

@NgModule({
  declarations: [
    DossierMedicalOPDComponent, 
  ],
  imports: [
    CommonModule,
    DossierMedicalOPDRoutingModule,
  ]
})
export class DossierMedicalOPDModule { }
