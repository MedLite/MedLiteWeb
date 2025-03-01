import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserCompoComponent } from './user-compo/user-compo.component';
import { LoginComponent } from './Authenfication/login/login.component';
import { MainComponent } from './Shared/main/main.component';
import { I18nService } from './Shared/i18n/i18n.service';

const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // {
  //   path: 'home', title: 'Dashboard Page', component: DashboardComponent,
  // },

  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent }, 
  { path: '', redirectTo: 'home', pathMatch: 'full' },


  // {
  //   path: 'userprofile', title: 'Dashboard Page', component: UserCompoComponent,
  // },
  { path: 'menu_parametarge', loadChildren: () => import('./menu-parametrage/menu-parametrage.module').then(m => m.MenuParametrageModule), data:{title:'Setting',icon:'bx bx-cog'} },
  { path: 'menu_reception', loadChildren: () => import('./menu-reception/menu-reception.module').then(m => m.MenuReceptionModule) , data:{title:'Reception',icon:'bx bx-first-aid'} },
  { path: 'dossier_medical_opd', loadChildren: () => import('./dossier-medical-opd/dossier-medical-opd.module').then(m => m.DossierMedicalOPDModule) , data:{title:'DossierMedical',icon:'bx bx-first-aid'} },
  { path: 'DossierMedicalIP', loadChildren: () => import('./dossier-medical-ip/dossier-medical-ip.module').then(m => m.DossierMedicalIPModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
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
