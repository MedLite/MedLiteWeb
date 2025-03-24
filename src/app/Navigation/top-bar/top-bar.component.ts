import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DomSanitizer } from '@angular/platform-browser'; 
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../Authenfication/JWT/_services/storage.service';
import { AuthService } from '../../Authenfication/JWT/_services/auth.service';
 
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css', providers: [I18nService]
})
export class TopBarComponent implements OnInit  {
  constructor(  private authServiceNew: AuthService, private storageService: StorageService, private route: ActivatedRoute,public i18nService: I18nService, private router: Router ,private sanitization: DomSanitizer) { }


  en:any = "EN";
  fr:any = "FR";
  ar:any = "AR";
  isLoggedIn = false;
  countries: any;
  selectedCountry: any;
  ngOnInit() {
    this.GetTokenFromStorage();
    // this.countries = [
    //   { name: 'Ar', code: 'LY', value: "ar" },
    //   { name: 'Eng', code: 'US', value: "en" },
    //   { name: 'Fr', code: 'FR', value: "fr" }

    // ];
    // this.selectedCountry = this.countries[0];
    // if (this.tokenStorage.getToken()) {
    //   this.isLoggedIn = true;
    //   this.reloadCurrentRoute();
    // }
  }

  reloadCurrentRoute() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {

      this.router.navigate(['home']);
    });
  }
  sanitize(img:any) {
    return this.sanitization.bypassSecurityTrustStyle(`url('${img}');`);
  }


  changeDirection(dir: 'ltr' | 'rtl') {
    localStorage.setItem('direction', dir);
    this.setDirection(); // Call the setDirection function again to apply the changes immediately
  }

  rlt:any = "rlt";
  ltr:any = "ltr";
  setDirection() {
    const direction = localStorage.getItem('direction'); // Get direction from localStorage

    if (direction === 'rtl') {
      document.body.classList.add('rtl'); // Add 'rtl' class
    } else {
      document.body.classList.remove('rtl'); // Remove 'rtl' class (default LTR)
    }
  }

  TokenOK:any ;

  GetTokenFromStorage(){
    let token = sessionStorage.getItem("auth-token");
    if(token==""){
      // window.location.reload();
      this.TokenOK = false; 
    }else{
      this.TokenOK = true; 

    }
  }

  LogOut() {
    // this.reloadPage();
    window.location.reload();
    this.storageService.clean();
  
  
    sessionStorage.clear();
    this.authServiceNew.logout().subscribe({
      next: (data:any) => { 
        this.isLoggedIn = false;  
      },
      error: (err:any) => {
        
      }
    });
 
    // this.router.navigate(['/login']);

  }

  reloadPage() {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }
}
