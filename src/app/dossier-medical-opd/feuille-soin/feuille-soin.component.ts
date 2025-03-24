import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MessageService } from 'primeng/api';
import { SessionStorageService } from '../service/SessionStorageService';
import { NavigationService } from '../service/NavigationService';
import { PatientSelectionService } from '../service/patientSelected/patient-selected.service';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TabView } from 'primeng/tabview';

@Component({
  selector: 'app-feuille-soin',
  templateUrl: './feuille-soin.component.html',
  styleUrls: ['./feuille-soin.component.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [MessageService]
})
export class FeuilleSoinComponent implements OnInit{

  NotSelectedPatient: boolean = false;
  SelectedPatient: boolean = false;
  codeAdmission: string | null = null; // Define type for codeAdmission
  formGroup!: FormGroup;
  constructor(  public i18nService: I18nService, private patientSelectionService: PatientSelectionService,private navigationService:NavigationService,private sessionStorageService: SessionStorageService,private router: Router, private route: ActivatedRoute, private messageService: MessageService) {}
  
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
    this.formGroup = new FormGroup({
      text: new FormControl<string | null>(null)
  });
   
    this.storedPatientData = this.sessionStorageService.getJsonItem('codeAdmissionSelected');
    if(this.storedPatientData === undefined || this.storedPatientData === null ){
      this.NotSelectedPatient = true;
      this.SelectedPatient = false;
    }else{
     
      this.patientSelectionService.setSelectedCodeAdmission(this.storedPatientData.codeSaisie || 'CodeSaisieAdmissionError');
      this.patientSelectionService.setSelectedPatientName(this.storedPatientData.patientDTO.nomCompltLt || 'NamePaitentError');
      this.patientSelectionService.setSelectedCodePatient(this.storedPatientData.patientDTO.codeSaisie || 'codeSaisiePatient');
      this.NotSelectedPatient = false;
      this.SelectedPatient = true;
  }

 
  }


  Add!: string;
  visibleModalCheifComplaint = false; 
  visbileModalHistoryAllergy = false; 
  visibleModalDiagnocis = false
  cheifComplaint = null;
  history = null;
  allergy = null;
  onOpenModal(mode: string) {
    this.Add = this.i18nService.getString('Add');

    this.visibleModalCheifComplaint = false; 
    this.visbileModalHistoryAllergy = false; 
    this.visibleModalDiagnocis = false; 
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'CheifComplaint') {
      button.setAttribute('data-target', '#ModalAddCheifComplaint');
      this.visibleModalCheifComplaint = true; 
    
    }else if (mode === 'HistoryAllergy'){
      button.setAttribute('data-target', '#ModalHistoryAllergy');
      this.visbileModalHistoryAllergy = true; 
    }
    if(mode === 'Diagnocis'){
      button.setAttribute('data-target', '#ModalDignocis');
      this.visibleModalDiagnocis = true; 
    }


  }


  PostCheifComplaint(){

  } 
  clearFormCheifComplaint(){
    this.visibleModalCheifComplaint = false;

  }

  PostHistoryAllergy(){

  } 
  clearFormHistoryAllergy(){
    this.visbileModalHistoryAllergy = false;

  }


}