import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DossierMedicalIPComponent } from './dossier-medical-ip.component';

const routes: Routes = [{ path: '', component: DossierMedicalIPComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DossierMedicalIPRoutingModule { }
