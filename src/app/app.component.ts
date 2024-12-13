import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

}
