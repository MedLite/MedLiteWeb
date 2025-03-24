import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../Shared/i18n/i18n.service'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../Authenfication/JWT/_services/user.service';

interface LogoData {
  code: number;
  logo: string;
  nomSociete: string;
  imagePath: string | null;
}


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(public i18nService: I18nService, public societe: UserService, private _sanitizer: DomSanitizer) { }
  logo: SafeResourceUrl | string | null = null; //Make sure it is initialized

  ngOnInit(): void {
   
      this.GetLogo();
    
    
  }

 
  GetLogo() {
    if(sessionStorage.getItem("NomSociete") == undefined ||  sessionStorage.getItem("NomSociete") ==null){
    
      this.societe.GetLogoClinique().subscribe(
        (data: any) => {
          
          if (typeof data.logo === 'string' && data.logo.trim() !== '') {
            sessionStorage.setItem("Logo",data.logo);
            this.logo = this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${data.logo}`);
            sessionStorage.setItem("NomSociete",data.nomSociete);
      
  
            
          } else {
            console.error("Invalid logo data received.");
            this.logo = '/path/to/default/logo.png'; //Fallback to default
          } 
        } 
      )
    }
    else{
      this.logo = this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${sessionStorage.getItem("Logo")}`);
    
    }
    



 
  }


}
