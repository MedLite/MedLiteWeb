import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

////// trans I18N

 
import * as enI18n from './Shared/i18n/en.i18n';
import * as frI18n from './Shared/i18n/fr.i18n';
import * as arI18n from './Shared/i18n/ar.i18n';
import { I18nModule } from './Shared/i18n/i18n.module';

/////// fin I18N
 

//// primeng

import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from "primeng/tabview";
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { PanelModule } from 'primeng/panel'; 
import { TabMenuModule } from 'primeng/tabmenu';


/////////////////////////////////////////////


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserCompoComponent } from './user-compo/user-compo.component';
import { SidebarComponent } from './Navigation/sidebar/sidebar.component';
import { TopBarComponent } from './Navigation/top-bar/top-bar.component';
import { FooterComponent } from './Navigation/footer/footer.component';


//primeng

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AlertComponent } from './Authenfication/alert/alert.component';
import { LoginComponent } from './Authenfication/login/login.component';
import { LoadingComponent } from './Shared/loading/loading.component';
import { CabinetComponent } from './menu-parametrage/cabinet/cabinet.component';
import { CaisseComponent } from './menu-parametrage/caisse/caisse.component';
import { FournisseurComponent } from './menu-parametrage/fournisseur/fournisseur.component';
import { MedecinComponent } from './menu-parametrage/medecin/medecin.component';
import { NationaliterComponent } from './menu-parametrage/nationaliter/nationaliter.component';
import { OperationComponent } from './menu-parametrage/operation/operation.component';
import { PrestationComponent } from './menu-parametrage/prestation/prestation.component';
import { SocieteComponent } from './menu-parametrage/societe/societe.component';
import { TypeIntervenantComponent } from './menu-parametrage/type-intervenant/type-intervenant.component';
import { VilleComponent } from './menu-parametrage/ville/ville.component';
import { BreadcrumbComponent } from './Shared/breadcrumb/breadcrumb.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts'; // Make sure you import echarts
import { ResponsableRemiseComponent } from './menu-parametrage/responsable-remise/responsable-remise.component';
import { AdmissionComponent } from './menu-reception/admission/admission.component';
import { EditionAdmissionComponent } from './menu-reception/edition-admission/edition-admission.component';
import { BanqueComponent } from './menu-parametrage/banque/banque.component';
import { ModeReglementComponent } from './menu-parametrage/mode-reglement/mode-reglement.component';
import { ChambreComponent } from './menu-reception/chambre/chambre.component';
import { PlanningMedecinComponent } from './menu-reception/planning-medecin/planning-medecin.component';
import { ClotureSessionComponent } from './menu-reception/cloture-session/cloture-session.component';
import { FamilleFacturationComponent } from './menu-parametrage/famille-facturation/famille-facturation.component';
import { FamilleOperationComponent } from './menu-parametrage/famille-operation/famille-operation.component';
import { FamillePrestationComponent } from './menu-parametrage/famille-prestation/famille-prestation.component';
import { ConventionComponent } from './menu-parametrage/convention/convention.component';
import { CouvertureComponent } from './menu-parametrage/couverture/couverture.component';
import { PriceListComponent } from './menu-parametrage/price-list/price-list.component';
import { CaisseReceptionComponent } from './menu-reception/caisse-reception/caisse-reception.component';

// import { authInterceptorProviders, AuthInterceptor } from './Authenfication/_helpers/auth.interceptor';
import { ModalContentComponent } from './Shared/modal-content/modal-content.component';
import { SpecialiteCabinetComponent } from './menu-parametrage/specialite-cabinet/specialite-cabinet.component';
import { SpecialiteMedecinComponent } from './menu-parametrage/specialite-medecin/specialite-medecin.component';
import { I18nPipe } from './Shared/i18n/i18n.pipe';
import { MenuActiveDirective } from './Shared/service/highlight';
import { ToFixedRoundPipe } from './Shared/service/ToFixedRoundPipe';
import { SousFamillePrestationComponent } from './menu-parametrage/sous-famille-prestation/sous-famille-prestation.component';
import { TypeOperationComponent } from './menu-parametrage/type-operation/type-operation.component';
import { BlocOperationComponent } from './menu-parametrage/bloc-operation/bloc-operation.component';
import { FeuilleSoinComponent } from './dossier-medical-opd/feuille-soin/feuille-soin.component';
import { ListAdmissionOPDComponent } from './dossier-medical-opd/list-admission-opd/list-admission-opd.component';
import { TreeTableModule } from 'primeng/treetable';
 
import { ToastModule } from 'primeng/toast';
import { RequestOPDComponent } from './dossier-medical-opd/request-opd/request-opd.component';
import { CustomSelectComponent } from './Shared/TAB/custom-select.component';
import { PrescriptionOPDComponent } from './dossier-medical-opd/prescription-opd/prescription-opd.component'; 
import { SignatureMedecinComponent } from './menu-parametrage/signature-medecin/signature-medecin.component';
import { AuthInterceptor, authInterceptorProviders } from './Authenfication/_helpers/auth.interceptor';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import { CustomDateFormatPipe } from './Shared/CommunFunction/CustomDateFormatPipe'; 
import { ReportViewerModule } from '../../projects/reportviewer/src/public-api';
 
const languages = [
  { lang: 'عربي', flag: 'assets/images/county/ar.png', file: arI18n, valeur: 'ar' },
  { lang: 'English', flag: 'assets/images/county/eng.png', file: enI18n, valeur: 'en' },
  { lang: 'Français', flag: 'assets/images/county/fr.png', file: frI18n, valeur: 'fr' }

]



@NgModule({
  declarations: [

    CustomSelectComponent,
    AppComponent,MenuActiveDirective,
    DashboardComponent,
    UserCompoComponent, BreadcrumbComponent,
    SidebarComponent,
    TopBarComponent, LoadingComponent, ToFixedRoundPipe, 
    FooterComponent, AlertComponent, LoginComponent,ModalContentComponent,
    ////// i18n //////////////// 
    I18nPipe,  CustomDateFormatPipe,
    ///// Menu parametrage 
    NationaliterComponent, VilleComponent,CabinetComponent,SocieteComponent, 
    PriceListComponent,CouvertureComponent,ConventionComponent,CaisseComponent, 
    FournisseurComponent, PrestationComponent,OperationComponent, TypeIntervenantComponent, 
    MedecinComponent, ResponsableRemiseComponent,ModeReglementComponent,FamilleFacturationComponent,
    BanqueComponent, FamilleOperationComponent,FamillePrestationComponent,SpecialiteCabinetComponent,SpecialiteMedecinComponent,
    SousFamillePrestationComponent,TypeOperationComponent,BlocOperationComponent,SignatureMedecinComponent,
    ////////////// Menu REception

    AdmissionComponent,EditionAdmissionComponent, CabinetComponent, ClotureSessionComponent,
    ChambreComponent, PlanningMedecinComponent, CaisseReceptionComponent,



    /// DMI 
    FeuilleSoinComponent,ListAdmissionOPDComponent,RequestOPDComponent,PrescriptionOPDComponent,

    
  ],
  imports: [   
    BrowserModule, NgxEchartsModule.forRoot({
      echarts, // Provide the echarts object here
    }),
    ChartModule, BrowserModule,PanelModule,TabMenuModule,
    ReactiveFormsModule, BrowserAnimationsModule,ToastModule,
   
    AppRoutingModule, DropdownModule,
    HttpClientModule, TreeTableModule,ScrollPanelModule,  DividerModule,
  
    I18nModule.forRoot(languages), TagModule, RippleModule, RatingModule, InputTextareaModule,
    CommonModule, ContextMenuModule, ToolbarModule, ConfirmDialogModule,
     TableModule, InputTextModule, FileUploadModule,
     ButtonModule, InputNumberModule, NoopAnimationsModule,
    FormsModule, DialogModule, RadioButtonModule,
    CalendarModule, CheckboxModule, TabViewModule,MenubarModule,ReportViewerModule

  ],
  // providers: [  provideHttpClient(withInterceptors([customInterceptor])),DatePipe, LoginComponent, LoadingComponent, HttpClient, MessageService,
    
  //   provideAnimationsAsync(),
  // ],

  providers: [  authInterceptorProviders,DatePipe, LoginComponent, LoadingComponent, HttpClient, MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true ,  },
    provideAnimationsAsync(),
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
