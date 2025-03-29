import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../Authenfication/JWT/_services/storage.service';
import { AuthService } from '../../Authenfication/JWT/_services/auth.service';
 
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css', providers: [I18nService]
})
export class TopBarComponent implements OnInit  {
  constructor(  private authServiceNew: AuthService, private storageService: StorageService,
     private route: ActivatedRoute,public i18nService: I18nService, private router: Router 
     ,private sanitization: DomSanitizer) { }


  en:any = "EN";
  fr:any = "FR";
  ar:any = "AR";
  isLoggedIn = false;
  countries: any;
  selectedCountry: any;
  ImageProfil: SafeResourceUrl | string | null = null; //Make sure it is initialized
  
  ngOnInit() {
    this.GetTokenFromStorage(); 
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
  userName:any;
  GetTokenFromStorage(){
    let token = sessionStorage.getItem("auth-token");
    if(token==""){
      // window.location.reload();
      this.TokenOK = false; 
    }else{
      this.TokenOK = true; 
      this.GetImageProfil();
      this.userName = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.userName?.toLowerCase();

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

  GetImageProfil() {
    if(sessionStorage.getItem("ImageProfil") == undefined ||  sessionStorage.getItem("ImageProfil") ==null){
    
      this.authServiceNew.GetImageProfil().subscribe(
        (data: any) => {
          
          if (typeof data.imageProfil === 'string' && data.imageProfil.trim() !== '') {
            sessionStorage.setItem("ImageProfil",data.imageProfil);
            this.ImageProfil = this.sanitization.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${data.imageProfil}`);
            // sessionStorage.setItem("NomSociete",data.nomSociete);
      
  
            
          } else {
            console.error("Invalid ImageProfil data received.");
            this.ImageProfil = '/path/to/default/logo.png'; //Fallback to default
          } 
        } 
      )
    }
    else{
      this.ImageProfil = this.sanitization.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${sessionStorage.getItem("ImageProfil")}`);
    
    }
    



 
  }


}
