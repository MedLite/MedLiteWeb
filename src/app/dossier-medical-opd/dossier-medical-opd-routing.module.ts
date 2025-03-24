import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DossierMedicalOPDComponent } from './dossier-medical-opd.component';
import { FeuilleSoinComponent } from './feuille-soin/feuille-soin.component';
import { ListAdmissionOPDComponent } from './list-admission-opd/list-admission-opd.component';
import { RequestOPDComponent } from './request-opd/request-opd.component'; 
import { PrescriptionOPDComponent } from './prescription-opd/prescription-opd.component';
const routes: Routes = [
  {
    path: '',
    component: DossierMedicalOPDComponent,
    children: [
      // { path: 'list_admission_opd', component: ListAdmissionOPDComponent },
      { path: 'feuille_soin_opd', component: FeuilleSoinComponent }, 
      { path: 'list_admission_opd', component: ListAdmissionOPDComponent }, 
      { path: 'request_opd', component: RequestOPDComponent }, 
      { path: 'prescription_opd', component: PrescriptionOPDComponent }, 

    ]
  },
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DossierMedicalOPDRoutingModule { }
