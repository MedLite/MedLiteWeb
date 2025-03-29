import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DossierMedicalOPDRoutingModule } from './dossier-medical-opd-routing.module';
import { DossierMedicalOPDComponent } from './dossier-medical-opd.component'; 
import { PrescriptionOPDComponent } from './prescription-opd/prescription-opd.component';
import { I18nPipeForDmi } from '../Shared/i18n/i18nForDmi.pipe';
 
import {MatMenuModule} from '@angular/material/menu';  

@NgModule({
  declarations: [
    DossierMedicalOPDComponent,I18nPipeForDmi
     
  ],
  imports: [
    CommonModule,
    DossierMedicalOPDRoutingModule,MatMenuModule
  ]
})
export class DossierMedicalOPDModule { }
