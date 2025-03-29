import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ParametargeService } from './menu-parametrage/ServiceClient/parametarge.service';
import { IdleService } from './idle.service';
import { environment } from '../environments/environment.development';
import { ModalService } from './Shared/modal/modal.service';
import { ModalContentComponent } from './Shared/modal-content/modal-content.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private modalService: ModalService, private idleService: IdleService, public param_service: ParametargeService, private router: Router, private ngZone: NgZone, private route: ActivatedRoute, private location: Location) { }

  title = 'MedLiteWeb';

  showSidebar = true;
  showTopBar = true;
  showFooter = true;
  showBreadcrumb = true;

  ngOnInit(): void {
    this.GetTokenFromStorage();
    this.setDirection();
    this.initialIdleSettings();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.applyMarginStyle(event.url);
        this.showHideComponents(event.url);
      }
    });
  }

  // private initialIdleSettings() {
  //   const idleTimeoutInSeconds: number = environment.idleTimeInMinutes * 60;
  //   this.idleService.startWatching(idleTimeoutInSeconds).subscribe((isTimeOut: boolean) => {
  //     console.log("isTimeOut  " , isTimeOut );
  //     console.log("idleTimeoutInSeconds  " , idleTimeoutInSeconds );

  //      if (isTimeOut) {
  //       if(!window.location.hash.includes('/login')){
  //         this.openModalComponent();
  //       }
  //     } 
  //   });
  // }


  private initialIdleSettings() {
    const idleTimeoutInSeconds: number = environment.idleTimeInMinutes * 60;
    this.idleService.startWatching(idleTimeoutInSeconds).subscribe((isTimeOut: boolean) => {
      if (isTimeOut) {
        // alert("Session timeout. It will redirect to login page.");
        if (!window.location.hash.includes('/login')) {
          this.openModalComponent();
        }

      }
    });
  }


  openModalComponent() {
    this.modalService.open(ModalContentComponent, {
      ignoreBackdropClick: true,
      backdrop: 'static',
      keyboard: false,
      focus: true,
      disableClose: true,
    });

  }


  setDirection() {
    let lang = sessionStorage.getItem("lang");
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
  }

  intervalId: any;
  TokenOK: any;
  TokenNo: any;
  GetTokenFromStorage() {
    let token = sessionStorage.getItem("auth-user");
    if (token == "" || token == undefined) {
      this.reloadPage();
      this.TokenOK = false;
    } else {
      this.TokenOK = true;
      this.GetCodeNatureAdmissionOPD();
      this.GetCodeNatureAdmissionER();
      this.GetCodeNatureAdmissionIP();
    }
  }

  reloadPage(): void {
    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  reloadPageCurrent() {
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }

  applyMarginStyle(url: string) {
    this.ngZone.runOutsideAngular(() => {
      const pageWrapper = document.querySelector('.page-wrapper') as HTMLElement;
      if (pageWrapper) {
        if (url.startsWith('/dossier_medical_opd') || url === '/login') {
          pageWrapper.style.marginRight = '0px';
          pageWrapper.style.marginLeft = '0px';
          pageWrapper.style.marginTop = '0px';
          pageWrapper.style.marginBottom = '0px';
        } else {
          pageWrapper.style.marginRight = '';
          pageWrapper.style.marginLeft = '';
          pageWrapper.style.marginTop = '';
          pageWrapper.style.marginBottom = '';
        }
      } else {
        console.error("Element with class 'page-wrapper' not found.");
      }
    });
  }

  showHideComponents(url: string) {


    const hideComponents = url.startsWith('/dossier_medical_opd');
    this.showSidebar = !hideComponents;
    this.showTopBar = !hideComponents;
    this.showFooter = !hideComponents;
    this.showBreadcrumb = !hideComponents;
  }



  codeNatureAdmissionOPD: any;
  codeNatureAdmissionER: any;
  GetCodeNatureAdmissionOPD() {
    if (sessionStorage.getItem("NatureAdmissionOPD") != undefined || sessionStorage.getItem("NatureAdmissionOPD") != null) {

    } else {
      this.param_service.GetParam("CodeNatureAdmissionOPD").
        subscribe((data: any) => {
          sessionStorage.setItem("NatureAdmissionOPD", data.valeur);
        })
    }

  }

  GetCodeNatureAdmissionER() {
    if (sessionStorage.getItem("NatureAdmissionER") != undefined || sessionStorage.getItem("NatureAdmissionER") != null) {

    } else {
      this.param_service.GetParam("CodeNatureAdmissionER").
        subscribe((data: any) => {
          sessionStorage.setItem("NatureAdmissionER", data.valeur);

        })
    }

  }

  GetCodeNatureAdmissionIP() {
    if (sessionStorage.getItem("NatureAdmissionIP") != undefined || sessionStorage.getItem("NatureAdmissionIP") != null) {

    } else {
      this.param_service.GetParam("CodeNatureAdmissionIP").
        subscribe((data: any) => {
          sessionStorage.setItem("NatureAdmissionIP", data.valeur);

        })
    }


  }

}




