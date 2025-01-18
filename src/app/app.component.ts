import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  title = 'MedLiteWeb';


  ngOnInit(): void {
 
    this.GetTokenFromStorage();
    this.setDirection();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.applyMarginStyle(event.url);
      }
    });
  }



  setDirection() {
    let lang = sessionStorage.getItem("lang");
    const direction = lang === 'ar' ? 'rtl' : 'ltr';  // Adjust as needed for your languages
    document.documentElement.dir = direction;


  }

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
    const pageWrapper = document.querySelector('.page-wrapper') as HTMLElement;
    if (url === '/login') { // Use the path part of the URL
      pageWrapper.style.marginRight = '0px'; 
      pageWrapper.style.marginTop = '0px'; 
      pageWrapper.style.marginBottom = '0px'; 
      
    } 
    
    // else {
    //   pageWrapper.style.height = '100%';
    //   pageWrapper.style.marginTop = '60px';
    //   pageWrapper.style.marginBottom = '30px';
    //   pageWrapper.style.marginRight = '220px';
    // }
  }


}
