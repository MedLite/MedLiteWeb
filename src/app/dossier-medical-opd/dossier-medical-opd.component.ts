import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Import the service
import { Subscription } from 'rxjs';
import { PatientSelectionService } from './service/patientSelected/patient-selected.service';
import { SessionStorageService } from './service/SessionStorageService';
@Component({
  selector: 'app-dossier-medical-opd',
  templateUrl: './dossier-medical-opd.component.html',
  styleUrls: ['./dossier-medical-opd.component.css', '.../../../src/assets/css/DMI.css']
})
export class DossierMedicalOPDComponent implements OnInit, OnDestroy {
  constructor(   private cdRef: ChangeDetectorRef ,private route: ActivatedRoute, public patientSelectionService: PatientSelectionService) { }

  CodePatient: string | null = null;
  PatientName: string | null = null;
  private subscription: Subscription = new Subscription();
  storedPatientData:any;
  ngOnInit() {

    if(sessionStorage.getItem("codeAdmissionSelected") != null || sessionStorage.getItem("codeAdmissionSelected") != undefined){
 
      this.subscription = this.patientSelectionService.selectedPatientCode$.subscribe(codeSaisie => {
        this.CodePatient = codeSaisie;
        this.cdRef.detectChanges(); 
        // this.savePatientDataToSessionStorage(); // Save to session storage
      });
      this.subscription = this.patientSelectionService.selectedPatientName$.subscribe(Name => {
        this.PatientName = Name;
        this.cdRef.detectChanges(); 
        // this.savePatientDataToSessionStorage(); // Save to session storage
      });
    }else{
      this.patientSelectionService.setSelectedPatientCode('');
      this.patientSelectionService.setSelectedPatientName( '');
    }

    

    // this.updateLinkVisibility();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

 

}
