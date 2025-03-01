import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MessageService } from 'primeng/api';
import { SessionStorageService } from '../service/SessionStorageService';
import { NavigationService } from '../service/NavigationService';
import { PatientSelectionService } from '../service/patientSelected/patient-selected.service';

@Component({
  selector: 'app-feuille-soin',
  templateUrl: './feuille-soin.component.html',
  styleUrl: './feuille-soin.component.css',
  providers: [MessageService]
})
export class FeuilleSoinComponent implements OnInit{

  NotSelectedPatient: boolean = false;
  SelectedPatient: boolean = false;
  codeAdmission: string | null = null; // Define type for codeAdmission

  constructor( private patientSelectionService: PatientSelectionService,private navigationService:NavigationService,private sessionStorageService: SessionStorageService,private router: Router, private route: ActivatedRoute, private messageService: MessageService) {}
  // ngAfterViewInit() {
  //   this.sessionStorageService.clearSessionStorageIfNecessary(); 
   
  //   // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select patisssent data.' });

  // }

  navigateToAdmissionList() {
    this.navigationService.navigateToAdmissionList();
  }
  reloadCurrentRoute() {
    
    setTimeout(() => {
      window.location.reload();
    }, 1);
     
  }

  reloadCurrentRoute2() {
    this.router.navigateByUrl('/dossier_medical_opd/list_admission_opd', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }
  storedPatientData :any;
  ngOnInit(): void { 
    let admTemp;
    this.storedPatientData = this.sessionStorageService.getJsonItem('codeAdmissionSelected');
    if(this.storedPatientData === undefined || this.storedPatientData === null ){
      this.NotSelectedPatient = true;
      this.SelectedPatient = false;
    }else{
     
      this.patientSelectionService.setSelectedPatientCode(this.storedPatientData.codeSaisie || 'v111');
      this.patientSelectionService.setSelectedPatientName(this.storedPatientData.name || 'xx');
      this.NotSelectedPatient = false;
      this.SelectedPatient = true;
  }


    // this.codeAdmission = sessionStorage.getItem("codeAdmissionSelected");
    // if (this.codeAdmission === null || this.codeAdmission === undefined || this.codeAdmission === "") {
    
    
     
    // } else {
   
    // } 
    // this.sessionStorageService.cleanupOnUnload();
  }
}