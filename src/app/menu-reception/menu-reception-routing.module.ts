import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuReceptionComponent } from './menu-reception.component';
import { I18nService } from '../Shared/i18n/i18n.service';
import { AdmissionComponent } from './admission/admission.component';
import { EditionAdmissionComponent } from './edition-admission/edition-admission.component';
import { ChambreComponent } from './chambre/chambre.component';
import { PlanningMedecinComponent } from './planning-medecin/planning-medecin.component';
import { ClotureSessionComponent } from './cloture-session/cloture-session.component';
import { CaisseReceptionComponent } from './caisse-reception/caisse-reception.component';
import { AdmissionERComponent } from './admission-er/admission-er.component';
import { AdmissionIPComponent } from './admission-ip/admission-ip.component';

const routes: Routes = [
  { path: '', component: MenuReceptionComponent }
  ,{
    path: 'admission_opd',
    component: AdmissionComponent ,
    data:{title:'AdmissionOPD' , icon :'fas fa-user'}
  }
  ,{
    path: 'admission_er',
    component: AdmissionERComponent ,
    data:{title:'AdmissionER' , icon :'fas fa-users'}
  }
  ,{
    path: 'admission_ip',
    component: AdmissionIPComponent ,
    data:{title:'AdmissionIP' , icon :'fas fa-user-injured'}
  },{
    path: 'edition_admission',
    component: EditionAdmissionComponent ,
    data:{title:'Edition' , icon :'bx bxs-report'}
  },{
    path: 'chambre',
    component: ChambreComponent ,
    data:{title:'Chambre' , icon :'bx bx-bed'}
  },{
    path: 'planning_medecin',
    component: PlanningMedecinComponent,
    data:{title:'PlanningMedcin' , icon :'bx bxs-spreadsheet'}
  }, {
    path: 'cloture_session',
    component: ClotureSessionComponent ,
    data:{title:'ClotureSession' , icon :'bx bx-lock-alt'}
  },
  {
    path: 'caisse_reception',
    component: CaisseReceptionComponent ,
    data:{title:'CaisseReception' , icon :'bx bx-wallet'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuReceptionRoutingModule { 
  constructor(private i18nService: I18nService) {
    this.translateRouteTitles();
  }
  translateRouteTitles() {
    routes.forEach(route => {
      if (route.data && route.data['title']) {
        route.data['title'] = this.i18nService.getString(route.data['title']);
      }
    });
  }

}
