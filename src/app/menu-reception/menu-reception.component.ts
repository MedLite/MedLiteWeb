import { Component, OnInit } from '@angular/core';
import { I18nService } from '../Shared/i18n/i18n.service';
import { ParametargeService } from '../menu-parametrage/ServiceClient/parametarge.service';
import { EncryptionService } from '../Shared/EcrypteService/EncryptionService';


@Component({
  selector: 'app-menu-reception',
  templateUrl: './menu-reception.component.html',
  styleUrls:[ './menu-reception.component.css', '.../../../src/assets/css/StyleMenu.css'
    , '.../../../src/assets/css/BS.css', '.../../../src/assets/css/BS3.7.css']
})
export class MenuReceptionComponent implements OnInit{

  showSubmenu: boolean = false;
  encryptedValue: string = '';
  constructor(private encryptionService: EncryptionService,public param_service: ParametargeService,public i18nService: I18nService) { }
  
  ngOnInit(): void {
    this.GetCodeNatureAdmissionOPD(); 
    this.GetCodeNatureAdmissionER(); 
    this.GetCodeNatureAdmissionIP(); 
    this.PasswordPecCash();
   }


  IsOpened = false;
  onOpened() { 
    this.IsOpened = true;
  } 
  onClosed() { 
    this.IsOpened = false; 
  } 


  IsOpened2 = false;
  onOpened2() { 
    this.IsOpened2 = true;
  } 
  onClosed2() { 
    this.IsOpened2 = false; 
  } 

  IsOpened3 = false;
  onOpened3() { 
    this.IsOpened3 = true;
  } 
  onClosed3() { 
    this.IsOpened3 = false; 
  } 

  IsOpened4 = false;
  onOpened4() { 
    this.IsOpened4 = true;
  } 
  onClosed4() { 
    this.IsOpened4 = false; 
  } 

  IsOpened5 = false;
  onOpened5() { 
    this.IsOpened5 = true;
  } 
  onClosed5() { 
    this.IsOpened5 = false; 
  } 

  IsOpened6 = false;
  onOpened6() { 
    this.IsOpened6 = true;
  } 
  onClosed6() { 
    this.IsOpened6 = false; 
  } 

  
  codeNatureAdmissionOPD: any;
  codeNatureAdmissionER: any;
  GetCodeNatureAdmissionOPD() {
    if(sessionStorage.getItem("NatureAdmissionOPD") != undefined ||  sessionStorage.getItem("NatureAdmissionOPD") != null ){

    }else{
      this.param_service.GetParam("CodeNatureAdmissionOPD").
      subscribe((data: any) => { 
        sessionStorage.setItem("NatureAdmissionOPD", data.valeur);
      })
    }
   
  }

  GetCodeNatureAdmissionER() {
    if(sessionStorage.getItem("NatureAdmissionER") != undefined ||  sessionStorage.getItem("NatureAdmissionER") != null ){

    }else{
      this.param_service.GetParam("CodeNatureAdmissionER").
      subscribe((data: any) => { 
        sessionStorage.setItem("NatureAdmissionER", data.valeur);

      })
    }
   
  }

  GetCodeNatureAdmissionIP() {
    if(sessionStorage.getItem("NatureAdmissionIP") != undefined ||  sessionStorage.getItem("NatureAdmissionIP") != null ){

    }else{
      this.param_service.GetParam("CodeNatureAdmissionIP").
      subscribe((data: any) => { 
        sessionStorage.setItem("NatureAdmissionIP", data.valeur);

      })
    } 
  }

  PasswordPecCash() {
    let PassAnnullApprouveTCX = sessionStorage.getItem("PassCashPEC");
    if (PassAnnullApprouveTCX == "" || PassAnnullApprouveTCX == null) {
      this.param_service.GetParam("PasswordCashPEC").subscribe(
        (res: any) => {
          let pass = res.valeur;
          this.encryptedValue = this.encryptionService.encrypt(pass);
          sessionStorage.setItem("PassCashPEC", this.encryptedValue);
        }
      )
    } else {

    }
  }

}
