import { Component, inject, OnInit } from '@angular/core';
 
import { ActivatedRoute, Router } from '@angular/router';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../../Shared/i18n/i18n.service';
import { StorageService } from '../JWT/_services/storage.service';
import { AuthService } from '../JWT/_services/auth.service';
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

  constructor( private authServiceNew: AuthService, private storageService: StorageService,private route: ActivatedRoute, public i18nService: I18nService , private router: Router) {

  }
  countries: any;

  selectedCountry: any;
  ngOnInit(): void {

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
  // onSubmit(): void {
  //   const { userName, password } = this.form;

  //   this.authService.sigin(userName, password).subscribe(
  //     data => {
  //       this.tokenStorage.saveToken(data.token);
  //       this.tokenStorage.saveUser(data);
  //       this.tokenStorage.SaveRefreshToken(data.refreshToken);

  //       sessionStorage.setItem("userName", userName);

  //       sessionStorage.setItem("lang", this.selectedCountry.value);

  //       this.isLoginFailed = false;
  //       this.isLoggedIn = true;


  //       this.reloadCurrentRoute();

  //     }, 
  //   );
  // }

  routers  = inject (Router);
  onSubmit(): void {
    const { userName, password } = this.form;

    this.authServiceNew.login(userName, password).subscribe({
      next: (data:any) => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        // this.reloadPage();
        this.reloadCurrentRoute(); 
      }
      
      // ,
      // error: (err:any) => {
      //   // console.log("errrorrr messgae not read ", err)
      //   // this.errorMessage = err.error.message;
      //   this.isLoginFailed = true;
      // }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }


  reloadCurrentRoute() {
    this.reloadPageCurrent();
    this.router.navigate(['/home']);
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


