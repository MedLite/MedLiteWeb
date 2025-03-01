import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private ngZone: NgZone,private route: ActivatedRoute, private location: Location) { } 

  title = 'MedLiteWeb';

  showSidebar = true;
  showTopBar = true;
  showFooter = true;
  showBreadcrumb = true;

  ngOnInit(): void {
    this.GetTokenFromStorage();
    this.setDirection();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.applyMarginStyle(event.url);
        this.showHideComponents(event.url);
      }
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
    let token = sessionStorage.getItem("auth-token");
    if (token == "" || token == undefined) {
      this.reloadPage();
      this.TokenOK = false;
    } else {
      this.TokenOK = true;
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
      const pageWrapper = document.querySelector('.page-wrapper')as HTMLElement;
      if (pageWrapper) {
        if (url.startsWith('/dossier_medical_opd') || url === '/login') {
          pageWrapper.style.marginRight = '0px';
          pageWrapper.style.marginTop = '0px';
          pageWrapper.style.marginBottom = '0px';
        } else {
          pageWrapper.style.marginRight = '';
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
}

  

 
