import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../../Shared/i18n/i18n.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  TokenValider: any;
  form: any = {
    userName: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private route: ActivatedRoute,public i18nService: I18nService, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {

  }
  countries: any;

  selectedCountry: any;
  // selectedLanguage: any
  ngOnInit(): void {
    const storedLang = sessionStorage.getItem('lang');

     

    // this.selectedLanguage = this.i18nService.langList.find((item: any) => item.valeur === this.i18nService.currentLanguage);

   
    this.countries = [
      { name: 'عربي', code: 'LY', value: 'ar' },
      { name: 'English', code: 'US', value: 'en' },
      { name: 'Français', code: 'FR', value: 'fr' }

    ];
    this.selectedCountry = this.countries[0];

    this.setDocumentDirection(this.selectedCountry.value); 
  }

  
  playSoundError() {
    let audio = new Audio();
    audio.src = "../assets/son/erro.mp3";
    audio.load();
    audio.play();
  } 
  onSubmit(): void {
    const { userName, password } = this.form;

    // this.authService.login(userName, password).subscribe(
    //   data => { 
    //     this.tokenStorage.saveToken(data.token);
    //     this.tokenStorage.saveUser(data); 

    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("auth-token", "xxxxx");

    sessionStorage.setItem("lang", this.selectedCountry.value);

    this.isLoginFailed = false;
    this.isLoggedIn = true;


    this.reloadCurrentRoute();

    // },
    // err => {
    //   if ([500].includes(err.status)) {
    //     alertifyjs.set('notifier', 'position', 'top-left');
    //     alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;font-size: 15px !important;;""></i>' + ` Service Core Not Available 503`);
    //     this.playSoundError();
    //   }


    //   this.isLoginFailed = true;

    // }
    // );
  }

   

  reloadCurrentRoute() {  
      this.router.navigate(['/home'], { relativeTo: this.route });
      this.reloadPageCurrent();
  }

  reloadPageCurrent() {
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }

  setDocumentDirection(langValue: string) {
    const direction = langValue === 'ar' ? 'rtl' : 'ltr';  // Adjust as needed for your languages
    document.documentElement.dir = direction;
    // localStorage.setItem('selectedLanguage', langValue);
  }


  changeLanguage() {
    this.i18nService.languageChange(this.selectedCountry.value);
    this.setDocumentDirection(this.selectedCountry.value);
  }


}


