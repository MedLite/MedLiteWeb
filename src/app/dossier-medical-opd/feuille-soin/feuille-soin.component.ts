import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SessionStorageService } from '../service/SessionStorageService';
import { NavigationService } from '../service/NavigationService';
import { PatientSelectionService } from '../service/patientSelected/patient-selected.service';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { DmiOpdService } from '../service/ServiceClient/dmi-opd.service';
import { catchError, of, map, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ReceptionService } from '../../menu-reception/ServiceClient/reception.service';

@Component({
  selector: 'app-feuille-soin',
  templateUrl: './feuille-soin.component.html',
  styleUrls: ['./feuille-soin.component.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [MessageService]
})
export class FeuilleSoinComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  NotSelectedPatient: boolean = false;
  SelectedPatient: boolean = false;
  codeAdmission: string | null = null; // Define type for codeAdmission
  formGroupAddComplaint!: FormGroup;
  formGroupLoadComplaint!: FormGroup;
  formGroupAddHistory!: FormGroup;
  formGroupLoadHistory!: FormGroup;
  formGroupAddAllergy!: FormGroup;
  formGroupLoadAllergy!: FormGroup;
  formGroupAddDignosis!: FormGroup;
  formGroupLoadDignosis!: FormGroup;
  loading = false;
  constructor(private dmi_opd_service: DmiOpdService,
    private CtrlAlertify: ControlServiceAlertify, public i18nService: I18nService,
    private patientSelectionService: PatientSelectionService,
    private navigationService: NavigationService, private sessionStorageService: SessionStorageService,
    private router: Router, private messageService: MessageService, private receptServie: ReceptionService) { }

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
  storedPatientData: any;
  private subscriptions: Subscription[] = [];
  ngOnInit(): void {

    this.formGroupAddComplaint = new FormGroup({
      text: new FormControl<string | null>(null)
    });
    this.formGroupLoadComplaint = new FormGroup({
      text: new FormControl<string | null>(null)
    });
    this.formGroupLoadAllergy = new FormGroup({
      text: new FormControl<string | null>(null)
    });

    this.formGroupAddAllergy = new FormGroup({
      text: new FormControl<string | null>(null)
    });
    this.formGroupLoadDignosis = new FormGroup({
      text: new FormControl<string | null>(null)
    });
    this.formGroupAddDignosis = new FormGroup({
      text: new FormControl<string | null>(null)
    });

    this.formGroupLoadHistory = new FormGroup({
      text: new FormControl<string | null>(null)
    });
    this.formGroupAddHistory = new FormGroup({
      text: new FormControl<string | null>(null)
    });


    this.storedPatientData = this.sessionStorageService.getJsonItem('codeAdmissionSelected');
    if (this.storedPatientData === undefined || this.storedPatientData === null) {
      this.NotSelectedPatient = true;
      this.SelectedPatient = false;
      this.CtrlAlertify.PostionLabelNotificationDMI();
      this.CtrlAlertify.showNotificationِCustom("PleaseSelectAnyAdmission");
      this.router.navigate(['/dossier_medical_opd/list_admission_opd']);
    } else {

      this.patientSelectionService.setSelectedCodeAdmission(this.storedPatientData.codeSaisie || 'CodeSaisieAdmissionError');
      this.patientSelectionService.setSelectedPatientName(this.storedPatientData.patientDTO.nomCompltLt || 'NamePaitentError');
      this.patientSelectionService.setSelectedCodePatient(this.storedPatientData.patientDTO.codeSaisie || 'codeSaisiePatient');
      this.NotSelectedPatient = false;
      this.SelectedPatient = true;
      this.GetCheifComplaintAdmission();
      this.GetHistoryAdmission();
      this.GetAllergyAdmission();
      this.GetDiagnosisAdmission();
      this.GetMenuItem();

    }




  }

  GetMenuItem() {
    this.items = [
      {
        label: 'History Patient',
        icon: 'fa-solid fa-clock-rotate-left',
        command: () => { this.onOpenModal("HistoryPatient") }
      },
      {
        label: 'Features',
        icon: 'pi pi-star'
      },
      {
        label: 'Reports',
        icon: 'fas fa-print',
        items: [
          {
            label: 'Patient File',
            icon: 'fa-brands fa-readme'
          },
          {
            label: 'Custom Patient File',
            icon: 'fa-brands fa-perbyte'
          }

        ]
      },
      {
        label: 'Discharge Authorization',
        icon: 'fa-solid fa-person-circle-check'
      }
    ]
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  userCreate = sessionStorage.getItem("userName");

  Add!: string;
  visibleModalCheifComplaint = false;
  visbileModalHistory = false;
  visbileModalAllergy = false;
  visibleModalDiagnosis = false;

  cheifComplaint = null;
  dignosis = null;
  history = null;
  allergy = null;
  visibleModalDeleteCheifComplaint = false;
  visibleModalDeleteAllergy = false;
  visibleModalDeleteDiagnosis = false;
  visibleModalDeleteHistory = false;

  visibleModalHistoryPatient = false;
  visibleModalDetailsAdmission = false;
  



  onOpenModal(mode: string) {
    this.Add = this.i18nService.getString('Add');

    this.visibleModalCheifComplaint = false;
    this.visbileModalHistory = false;
    this.visbileModalAllergy = false;
    this.visibleModalDiagnosis = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'CheifComplaint') {
      button.setAttribute('data-target', '#ModalAddCheifComplaint');
      this.visibleModalCheifComplaint = true;

    } else if (mode === 'History') {
      button.setAttribute('data-target', '#ModalHistory');
      this.visbileModalHistory = true;
    } else if (mode === 'Allergy') {
      button.setAttribute('data-target', '#ModalAllergy');
      this.visbileModalAllergy = true;
    }
    else if (mode === 'Diagnosis') {
      button.setAttribute('data-target', '#ModalDiagnosis');
      this.visibleModalDiagnosis = true;
    } else if (mode === 'DeleteCheifComplaint') {
      if (this.dataCheifComplaintAdmission == "") {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ErrorFetchDataDMI("Complaint Empty")
      } else {
        button.setAttribute('data-target', '#ModalDeleteCheifComplaint');
        this.visibleModalDeleteCheifComplaint = true;
      }

    } else if (mode === 'DeleteHistory') {
      if (this.dataHistoryAdmission == "") {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ErrorFetchDataDMI("History Empty")
      } else {
        button.setAttribute('data-target', '#ModalDeleteHistory');
        this.visibleModalDeleteHistory = true;
      }

    }
    else if (mode === 'DeleteAllergy') {
      if (this.dataAllergyAdmission == "") {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ErrorFetchDataDMI("Allergy Empty")
      } else {
        button.setAttribute('data-target', '#ModalDeleteAllergy');
        this.visibleModalDeleteAllergy = true;
      }

    }
    else if (mode === 'DeleteDiagnosis') {
      if (this.dataDiagnosisAdmission == "") {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ErrorFetchDataDMI("Diagnosis Empty")
      } else {
        button.setAttribute('data-target', '#ModalDeleteDiagnosis');
        this.visibleModalDeleteDiagnosis = true;
      }

    }
    else if (mode === 'HistoryPatient') { 
      button.setAttribute('data-target', '#ModalHistoryPatient');
      this.visibleModalHistoryPatient = true;
      this.GetColumnsTabAdmissionByCodePatient();
      this.GetListAdmissionByCodePatient(); 
    } else if (mode === 'DetailsAdmission') {  
      if(this.SelectedAdmissionByCodePatient  == null  || this.SelectedAdmissionByCodePatient.length == 0    ){
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ErrorFetchDataDMI(" Select Any Row");
      } else{
        button.setAttribute('data-target', '#ModalDetailsAdmission');
        this.visibleModalDetailsAdmission = true;
      } 
    }

  }


  PostCheifComplaint() {

    if (this.cheifComplaint == "") {
      this.CtrlAlertify.PostionLabelNotificationDMI();
      this.CtrlAlertify.showNotificationِCustom("PleaseRemplireAnyComplaint")
    } else {
      const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code;
      const formData = {
        text: this.formGroupAddComplaint.get('text')?.value // Access the value from the form group
      };
      const jsonData = JSON.stringify(formData, null, 2); // 2 spaces for indentation

      let body = {
        codeAdmission: codeAdmission,
        userCreate: this.userCreate,
        cheifComplaint: jsonData
      }

      this.dmi_opd_service.PostCheifComplaint(body).subscribe({
        next: () => {
          this.CtrlAlertify.PostionLabelNotificationDMI();
          this.CtrlAlertify.ShowSavedOKDMI();
          this.visibleModalCheifComplaint = false;
          // this.ngOnInit();
          this.GetCheifComplaintAdmission();
          this.clearFormCheifComplaint();


        },
        error: (err) => {
          console.error("An unexpected error occurred:", err);
        }
      });



    }


  }
  clearFormCheifComplaint() {
    this.visibleModalCheifComplaint = false;

  }





  dataCheifComplaintAdmission: string | null = null; // Initialize with null 
  GetCheifComplaintAdmission() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';

    this.dmi_opd_service.GetCheifComplaintByCodeAdmission(codeAdmission)
      .pipe(
        map((data: any) => {
          if (data && data.length > 0 && data[0].cheifComplaint) {
            try {
              return JSON.parse(data[0].cheifComplaint).text; // Directly get the 'text' property
            } catch (parseError) {
              console.error("Error parsing chief complaint JSON:", parseError);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to parse chief complaint JSON.' });
              return ''; // Return empty string on parse error
            }
          } else {
            return ''; // Handle missing or empty data
          }
        }),
        catchError(error => {
          console.error("Error fetching chief complaint:", error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch chief complaint.' });
          return of(''); // Return observable of empty string
        })
      )
      .subscribe((chiefComplaintText: string) => {
        this.dataCheifComplaintAdmission = chiefComplaintText;
      });
  }



  RemoveCheifComplaint() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';
    this.dmi_opd_service.DeleteCheifComplaintByCodeAdmission(codeAdmission).subscribe(
      () => {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ShowDeletedOKDMI();
        // this.ngOnInit();
        this.GetCheifComplaintAdmission();
        this.visibleModalDeleteCheifComplaint = false;
      }
    )
  }


  CloseModalConfirmationDeleteCheifComplaint() {
    this.visibleModalDeleteCheifComplaint = false;
  }


  PostAllergy() {
    if (this.allergy == "") {
      this.CtrlAlertify.PostionLabelNotificationDMI();
      this.CtrlAlertify.showNotificationِCustom("PleaseRemplireAnyAllergy")
    } else {
      const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code;
      const formData = {
        text: this.formGroupAddAllergy.get('text')?.value // Access the value from the form group
      };
      const jsonData = JSON.stringify(formData, null, 2); // 2 spaces for indentation

      let body = {
        codeAdmission: codeAdmission,
        userCreate: this.userCreate,
        allergy: jsonData
      }

      this.dmi_opd_service.PostAllergy(body).subscribe({
        next: () => {
          this.CtrlAlertify.PostionLabelNotificationDMI();
          this.CtrlAlertify.ShowSavedOKDMI();
          this.visbileModalAllergy = false;
          this.GetAllergyAdmission();
          this.clearFormAllergy();


        },
        error: (err) => {
          console.error("An unexpected error occurred:", err);
        }
      });



    }

  }
  clearFormAllergy() {
    this.visbileModalAllergy = false;

  }



  dataAllergyAdmission: string | null = null; // Initialize with null 
  GetAllergyAdmission() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';

    this.dmi_opd_service.GetAllergyByCodeAdmission(codeAdmission)
      .pipe(
        map((data: any) => {
          if (data && data.length > 0 && data[0].allergy) {
            try {
              return JSON.parse(data[0].allergy).text; // Directly get the 'text' property
            } catch (parseError) {
              console.error("Error parsing allergy JSON:", parseError);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to parse chief complaint JSON.' });
              return ''; // Return empty string on parse error
            }
          } else {
            return ''; // Handle missing or empty data
          }
        }),
        catchError(error => {
          console.error("Error fetching allergy:", error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch allergy.' });
          return of(''); // Return observable of empty string
        })
      )
      .subscribe((allergyText: string) => {
        this.dataAllergyAdmission = allergyText;
      });
  }



  RemoveAllergy() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';
    this.dmi_opd_service.DeleteAllergyByCodeAdmission(codeAdmission).subscribe(
      () => {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ShowDeletedOKDMI();
        this.GetAllergyAdmission();
        this.visibleModalDeleteAllergy = false;
      }
    )
  }



  CloseModalConfirmationDeleteAllergy() {
    this.visibleModalDeleteAllergy = false;
  }




  //// diagnosis


  PostDiagnosis() {
    if (this.dignosis == "") {
      this.CtrlAlertify.PostionLabelNotificationDMI();
      this.CtrlAlertify.showNotificationِCustom("PleaseRemplireAnyDiagnosis")
    } else {
      const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code;
      const formData = {
        text: this.formGroupAddDignosis.get('text')?.value // Access the value from the form group
      };
      const jsonData = JSON.stringify(formData, null, 2); // 2 spaces for indentation

      let body = {
        codeAdmission: codeAdmission,
        userCreate: this.userCreate,
        diagnosis: jsonData
      }

      this.dmi_opd_service.PostDiagnosis(body).subscribe({
        next: () => {
          this.CtrlAlertify.PostionLabelNotificationDMI();
          this.CtrlAlertify.ShowSavedOKDMI();
          this.visibleModalDiagnosis = false;
          this.GetDiagnosisAdmission();
          this.clearFormDiagnosis();


        },
        error: (err) => {
          console.error("An unexpected error occurred:", err);
        }
      });



    }

  }
  clearFormDiagnosis() {
    this.visibleModalDiagnosis = false;

  }



  dataDiagnosisAdmission: string | null = null; // Initialize with null 
  GetDiagnosisAdmission() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';

    this.dmi_opd_service.GetDiagnosisByCodeAdmission(codeAdmission)
      .pipe(
        map((data: any) => {
          if (data && data.length > 0 && data[0].diagnosis) {
            try {
              return JSON.parse(data[0].diagnosis).text; // Directly get the 'text' property
            } catch (parseError) {
              console.error("Error parsing diagnosis JSON:", parseError);

              this.CtrlAlertify.PostionLabelNotificationDMI();
              this.CtrlAlertify.ErrorFetchDataDMI("Failed to parse diagnosis JSON ");
              // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to parse diagnosis JSON.' });
              return ''; // Return empty string on parse error
            }
          } else {
            return ''; // Handle missing or empty data
          }
        }),
        catchError(error => {
          console.error("Error fetching diagnosis:", error);

          this.CtrlAlertify.PostionLabelNotificationDMI();
          this.CtrlAlertify.ErrorFetchDataDMI("Failed to fetch diagnosis.");
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch diagnosis.' });
          return of(''); // Return observable of empty string
        })
      )
      .subscribe((diagnosisText: string) => {
        this.dataDiagnosisAdmission = diagnosisText;
      });
  }



  RemoveDiagnosis() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';
    this.dmi_opd_service.DeleteDiagnosisByCodeAdmission(codeAdmission).subscribe(
      () => {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ShowDeletedOKDMI();
        this.GetDiagnosisAdmission();
        this.visibleModalDeleteDiagnosis = false;
      }
    )
  }



  CloseModalConfirmationDeleteDiagnosis() {
    this.visibleModalDeleteDiagnosis = false;
  }


  /// history 


  PostHistory() {
    if (this.history == "") {
      this.CtrlAlertify.PostionLabelNotificationDMI();
      this.CtrlAlertify.showNotificationِCustom("PleaseRemplireAnyHistory")
    } else {
      const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code;
      const formData = {
        text: this.formGroupAddHistory.get('text')?.value // Access the value from the form group
      };
      const jsonData = JSON.stringify(formData, null, 2); // 2 spaces for indentation

      let body = {
        codeAdmission: codeAdmission,
        userCreate: this.userCreate,
        pastHistory: jsonData
      }

      this.dmi_opd_service.PostHistory(body).subscribe({
        next: () => {
          this.CtrlAlertify.PostionLabelNotificationDMI();
          this.CtrlAlertify.ShowSavedOKDMI();
          this.visbileModalHistory = false;
          this.GetHistoryAdmission();
          this.clearFormHistory();


        },
        error: (err) => {
          console.error("An unexpected error occurred:", err);
        }
      });



    }


  }
  clearFormHistory() {
    this.visbileModalHistory = false;

  }


  dataHistoryAdmission: string | null = null; // Initialize with null 
  GetHistoryAdmission() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';

    this.dmi_opd_service.GetHistoryByCodeAdmission(codeAdmission)
      .pipe(
        map((data: any) => {
          if (data && data.length > 0 && data[0].pastHistory) {
            try {
              return JSON.parse(data[0].pastHistory).text; // Directly get the 'text' property
            } catch (parseError) {
              console.error("Error parsing history JSON:", parseError);

              this.CtrlAlertify.PostionLabelNotificationDMI();
              this.CtrlAlertify.ErrorFetchDataDMI("Failed to parse history JSON ");
              // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to parse diagnosis JSON.' });
              return ''; // Return empty string on parse error
            }
          } else {
            return ''; // Handle missing or empty data
          }
        }),
        catchError(error => {
          console.error("Error fetching history:", error);

          this.CtrlAlertify.PostionLabelNotificationDMI();
          this.CtrlAlertify.ErrorFetchDataDMI("Failed to fetch history.");
          // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch diagnosis.' });
          return of(''); // Return observable of empty string
        })
      )
      .subscribe((HistoryText: string) => {
        this.dataHistoryAdmission = HistoryText;
      });
  }



  RemoveHistory() {
    const codeAdmission = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.code || '';
    this.dmi_opd_service.DeleteHistoryByCodeAdmission(codeAdmission).subscribe(
      () => {
        this.CtrlAlertify.PostionLabelNotificationDMI();
        this.CtrlAlertify.ShowDeletedOKDMI();
        this.GetHistoryAdmission();
        this.visibleModalDeleteHistory = false;
      }
    )
  }



  CloseModalConfirmationDeleteHistory() {
    this.visibleModalDeleteHistory = false;
  }


 
  CloseModalHistoryPatient() {
    this.visibleModalHistoryPatient = false;
  }

  CloseModalDetailsAdmission() {
    this.visibleModalDetailsAdmission = false;
  }


  dataRequestLabo = new Array<any>();
  dataAdmissionByCodePatient = new Array<any>();
  SelectedAdmissionByCodePatient: any[] = [];
  colsTabAdmissionByCodePatient!: any[];


  onRowSelectFromTabAdmissionByCodePatient(event: any) {




  }



  onRowUnselectFromTabAdmissionByCodePatient(event : any) {
  }


  GetColumnsTabAdmissionByCodePatient() {
    this.colsTabAdmissionByCodePatient = [
      { field: 'cabinetDTO.specialiteCabinetDTO.designationLt', header: 'Speciality Cabinet ', width: '20%', filter: "true", type: "text" },
      { field: 'codeSaisie', header: 'Code ', width: '20%', filter: "true", type: "text" },
      { field: 'designationLt', header: 'Arrival Date', width: '20%', filter: "true", type: "date" },
      { field: 'medecionDTO.nomIntervAr', header: 'Doctor', width: '20%', filter: "true", type: "text" },
      // { field: 'complaintDTO.cheifComplaint', header: 'Complaint', width: '30%', filter: "true", type: "text" },
      { field: '', header: 'Details', width: '10%', filter: "true", type: "text" },

    ]
  }




  GetListAdmissionByCodePatient() {
    const codePatient = JSON.parse(sessionStorage.getItem("codeAdmissionSelected") ?? '{}')?.codePatient || '';
    this.receptServie.GetAdmissionByCodePatient(codePatient).subscribe((data: any) => {
      this.dataAdmissionByCodePatient = data;
    })
  }

}