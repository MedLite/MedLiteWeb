import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { Dropdown } from 'primeng/dropdown';
import { ReceptionService } from '../ServiceClient/reception.service';
import { ParametargeService } from '../../menu-parametrage/ServiceClient/parametarge.service';



import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; //You still need map from rxjs/operators
import { HttpErrorResponse } from '@angular/common/http';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface PlanningCabinetDTO {
  code: any;
  codeMedecin: number;
  codeCabinet: number;
  dateCreate: string;
  actif: boolean;
  dateExiste: string;
  nbrePlaceDispo: number;
}

interface MyData {
  column1: string;
  column2: string;
  groupingColumn: string; // The column to group by
}
@Component({
  selector: 'app-planning-medecin',
  templateUrl: './planning-medecin.component.html',
  styleUrls: ['./planning-medecin.component.css', '.../../../src/assets/css/StyleGroupBtnAndTable.css',
    '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [ConfirmationService, MessageService, InputValidationService, CalanderTransService, ControlServiceAlertify]
})
export class PlanningMedecinComponent implements OnInit {
 
  // displayedColumns: string[] = ['column1', 'column2'];
  dataSource: MatTableDataSource<MyData> = new MatTableDataSource<MyData>([]);
  @ViewChild(MatSort) sort!: MatSort;


  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('nbrePlaceDispoInput') nbrePlaceDispoInputElement!: ElementRef;
  @ViewChild('cabinetInput') cabinetInputElement!: Dropdown;
  @ViewChild('medecinInput') medecinInputElement!: Dropdown;

  first = 0;
  IsLoading = true;
  openModal!: boolean;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  LabelConsultationOPD = "";
  LabelConsultationER = "";
  constructor(private calandTrans: CalanderTransService, public recept_service: ReceptionService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef, public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify) {
    this.calandTrans.setLangAR();
  }


  // itemsNatureAdmission: MenuItem[] | undefined;
  // activeItemNatureAdmission: MenuItem | undefined;

  @ViewChild('modal') modal!: any;

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];
  formHeader = ".....";
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any;
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string;
  userCreate = sessionStorage.getItem("userName");
  dataMedecin = new Array<any>();
  dataPlanningCabinet = new Array<any>();
  selectedPlanning!: any;
  ListspecialiteMedecin = new Array<any>();
  selectedCabinet: any = '';

  dateDisponible: any;
  dateDisponibleRechercheDu: any;
  dateDisponibleRechercheAu: any;
  DateTempNew: any;
  DateTempNewRechercheDu: any;
  DateTempNewRechercheAu: any;
  ListMedecin = new Array<any>();
  ListCabinet = new Array<any>();
  selectedMedecins: any = '';
  NbrePlaceDisponible = '';
  ListPrestationOPD = new Array<any>();
  ListPrestationER = new Array<any>();
  SelectedPrestationOPD: any = '';
  SelectedPrestationER: any = '';

  autoriseFrais!: boolean;
  LabelautoriseFrais !: string;

  autoriseCons!: boolean;
  LabelautoriseCons !: string;

  VisibleAutoriseConsultation: boolean = false;

  ColumnPlanningTabel!: any[];
  ListPlanningCabinetTabel = new Array<any>();
  SelectedPlanningRow: any;
  medecinOPD: boolean = false;
  medecinER: boolean = false;

  disbledMedecinSelected: boolean = false;
  ngOnInit(): void {
  
    this.items = [
      { value: true, label: this.i18nService.getString('LabelActif') || 'LabelActif', icon: 'pi pi-file-check', command: () => { this.GetAllPlanningCabinetActif() } },
      { value: false, label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel', command: () => { this.GetAllPlanningCabinetInactif() } },
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file', command: () => { this.GetAllPlanningCabinet() } },
    ];
    this.activeItem = this.items[0];

    this.GetColumns();
    this.GetAllPlanningCabinetActif();
  }


  GetColumns() {
    this.cols = [
      { field: 'dateExiste', header: this.i18nService.getString('DateDispo') || 'dateExiste', width: '20%', filter: "true" },
      { field: 'medecinDT.nomIntervAr', header: this.i18nService.getString('Medecin') || 'Medecin', width: '16%', filter: "true" },
      
      { field: 'cabinetDTO.designationAr', header: this.i18nService.getString('Cabinet') || 'Cabinet', width: '16%', filter: "true" },

      { field: 'nbrePlaceDispo', header: this.i18nService.getString('NbrePlaceDisponible') || 'NbrePlaceDisponible', width: '16%', filter: "true" },
      { field: 'nbrePlaceUtiliser', header: this.i18nService.getString('nbrePlaceUtiliser') || 'nbrePlaceUtiliser', width: '16%', filter: "false" },

      { field: 'actif', header: this.i18nService.getString('LabelActif') || 'Actif', width: '16%', filter: "true" },

    ];
  }
  GetColumnsTabPlanning() {
    this.ColumnPlanningTabel = [

      { field: 'code', header: this.i18nService.getString('Code') || 'Code', width: '16%', filter: "true", visible: false },

      { field: 'nomIntervAr', header: this.i18nService.getString('NomMedecin') || 'Medecin', width: '16%', filter: "true", visible: true },
      { field: 'dateDispo', header: this.i18nService.getString('DateDispo') || 'DateDispo', width: '16%', filter: "true", visible: true },
      { field: 'nbrePlaceDispo', header: this.i18nService.getString('NbrePlaceDisponible') || 'NbrePlaceDisponible', width: '16%', filter: "true", visible: true },
      { field: '', header: this.i18nService.getString('Delete') || 'Delete', width: '16%', filter: "true", visible: true },

    ]
  }

  // RemplireTablePlanningCabinet(){
  //   this.ListPlanningCabinetTabel = [
  //     {codeInterv:12,nomIntervAr:'amine',nbrePlaceDispo:'33'},
  //     {codeInterv:13,nomIntervAr:'ali',nbrePlaceDispo:'44'},
  //     {codeInterv:14,nomIntervAr:'soufien',nbrePlaceDispo:'35'},
  //   ]
  // }
  @Output() closed: EventEmitter<string> = new EventEmitter();
  closeThisComponent() {
    const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
    this.closed.emit(parentUrl);
    this.router.navigate([parentUrl]);
  }

  CloseModalPrint() {
    this.visibleModalPrint = false;
  }




  clear(table: Table) {
    table.clear();
    this.searchTerm = '';
  }

  clearForm() {
    this.code == undefined;
    this.designationAr = '';
    this.designationLt = '';
    this.actif = false;
    this.visibleModal = false;
    this.codeSaisie = '';
    this.selectedPlanning = ''
    this.selectedCabinet = '';
    this.selectedMedecins = '';
    // this.autoriseFrais = false;
    // this.autoriseCons = false;
    // this.SelectedPrestationER = '';
    // this.SelectedPrestationOPD = ''
    this.ListPlanningCabinetTabel = new Array<any>();

    this.onRowUnselect(event);

  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisieMedecin").
      subscribe((data: any) => {
        this.codeSaisie = data.prefixe + data.suffixe;
      })
  }


  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.selectedCabinet = event.data.codeCabinet;
    this.selectedMedecins = event.data.codeMedecin;
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteMedecin(code: any) {
    this.param_service.DeleteMedecin(code).subscribe(
      (res: any) => {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit();
        this.visDelete = false;

      }
    )
  }


  public onOpenModal(mode: string) {


    this.LabelActif = this.i18nService.getString('LabelActif');

    this.LabelautoriseFrais = this.i18nService.getString('LabelautoriseFrais');
    this.LabelautoriseCons = this.i18nService.getString('LabelautoriseCons');
    this.visibleModal = false;
    this.visDelete = false;
    this.visibleModalPrint = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = this.i18nService.getString('Add');
      this.onRowUnselect(event);

      this.clearForm();
      this.GetMedecinForPlanningOPD();
      this.GetAllCabinetActif();
      this.GetColumnsTabPlanning();


      this.actif = false;
      this.visible = false;
      this.visibleModal = true;
      this.code == undefined;
      this.disbledMedecinSelected = false;


    }
    if (mode === 'edit') {


      if (this.code == undefined) {
        this.clearForm();
        this.onRowUnselect(event);
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showChoseAnyRowNotification();
        this.visDelete == false && this.visibleModal == false
      } else {


        button.setAttribute('data-target', '#Modal');
        this.formHeader = this.i18nService.getString('Modifier');

        this.GetMedecinForPlanningOPD();
        this.GetAllCabinetActif();
        this.GetColumnsTabPlanning();
        this.GetPlanningCabinetByCode(this.selectedPlanning.code);
        this.disbledMedecinSelected = true;
        this.visibleModal = true;
        this.onRowSelect;

      }

    }

    if (mode === 'Delete') {

      if (this.code == undefined) {
        this.onRowUnselect;
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showChoseAnyRowNotification();
        this.visDelete == false && this.visibleModal == false
      } else {

        {
          button.setAttribute('data-target', '#ModalDelete');
          this.formHeader = this.i18nService.getString('Delete');
          this.visDelete = true;

        }
      }

    }

    if (mode === 'Print') {
      if (this.code == undefined) {
        this.onRowUnselect;
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showChoseAnyRowNotification();
        this.visDelete == false && this.visibleModal == false && this.visibleModalPrint == false
      } else {
        button.setAttribute('data-target', '#ModalPrint');
        this.formHeader = "Imprimer Liste SpecialiteMedecin"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const cabinet = this.validationService.validateDropDownCommun(this.cabinetInputElement, this.selectedCabinet);

    const mdecin = this.validationService.validateDropDownCommun(this.medecinInputElement, this.selectedMedecins);

    return cabinet && mdecin;
  }



  prepareDataForPost(): PlanningCabinetDTO[] { // Use DTO type for better type safety
    return this.ListPlanningCabinetTabel.map((item) => {
      const date = new Date(item.dateDispo); //Convert date string to Date object
      if (isNaN(date.getTime())) {
        console.error("Invalid Date format in table:", item.dateDispo)
        return null; //Skip saving if date is invalid
      }
      return {
        code: null,
        codeMedecin: item.code,
        codeCabinet: this.selectedCabinet,
        dateCreate: new Date().toISOString(),
        actif: this.actif,
        dateExiste: this.datePipe.transform(date, 'yyyy-MM-dd'), // Format the date
        nbrePlaceDispo: item.nbrePlaceDispo,
        nbrePlaceUtiliser: 0
      } as PlanningCabinetDTO; // Type assertion for TypeScript
    }).filter(item => item !== null); //Remove null values from array
  }


  PostPlanning() {
    const isValid = this.validateAllInputs();
    if (!isValid || this.ListPlanningCabinetTabel.length === 0) {
      console.error('Please fill in all required fields or add entries to the planning table.');
      this.CtrlAlertify.showNotificationِCustom("Veuillez remplir tous les champs obligatoires ou ajouter des entrées au tableau de planification."); // Show an error message
      return;
    }

    const planningData = this.prepareDataForPost();

    // if (this.code != null) {


    //   this.recept_service.UpdatePlanningCabinet(planningData).subscribe(

    //     (res: any) => {
    //       this.CtrlAlertify.PostionLabelNotification();
    //       this.CtrlAlertify.ShowSavedOK();
    //       this.visibleModal = false;
    //       this.clearForm();
    //       this.ngOnInit();
    //       this.onRowUnselect(event);


    //     }
    //   );


    // }
    // else {
    //   this.recept_service.PostPlanningCabinetList(planningData).pipe( // Single API call
    //     catchError((error: HttpErrorResponse) => {
    //       console.error('Error saving planning:', error);
    //       return throwError(() => new Error('Failed to save planning.'));
    //     })
    //   ).subscribe({
    //     next: (res: any) => {
    //       this.CtrlAlertify.PostionLabelNotification();
    //       this.CtrlAlertify.ShowSavedOK();
    //       this.visibleModal = false;
    //       this.clearForm();
    //       this.ngOnInit();
    //       this.code;
    //       this.onRowUnselect(event);
    //       this.clearForm();
    //     },
    //     error: (err) => {
    //       console.error("An unexpected error occurred:", err);
    //       //Consider more specific user feedback based on the error (e.g., network error vs. validation error from the server).
    //     }
    //   });
    // }


    if (this.code != null) {
      //Handle updates here:  Iterate and update individual records.
      this.updateExistingRecords(planningData);
    } else {
      // Handle new records (Post) as before
      this.addNewRecords(planningData);
    }


  }


  addNewRecords(planningData: PlanningCabinetDTO[]) {
    this.recept_service.PostPlanningCabinetList(planningData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error saving planning:', error);
        return throwError(() => new Error('Failed to save planning.'));
      })
    ).subscribe({
      next: (res: any) => {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.ShowSavedOK();
        this.visibleModal = false;
        this.clearForm();
        this.ngOnInit();
        this.code;
        this.onRowUnselect(event);
        this.clearForm();
      },
      error: (err) => {
        console.error("An unexpected error occurred:", err);
      }
    });
  }

  updateExistingRecords(planningData: PlanningCabinetDTO[]) {
    planningData.forEach(item => {
      item.code = this.code;
      this.recept_service.UpdatePlanningCabinet(item).subscribe({
        next: (res) => {
          this.CtrlAlertify.PostionLabelNotification();
          this.CtrlAlertify.ShowUpdatedOK();
          this.visibleModal = false;
          this.clearForm();
          this.ngOnInit();
          this.code;
          this.onRowUnselect(event);
          this.clearForm();
        },
        error: (err) => {
          console.error('Error updating planning item:', item.code, err);
          //Handle individual update errors appropriately (e.g. show an alert for the specific record that failed)
        }
      })
    })
  }









  GetAllPlanningCabinet() {
    this.IsLoading = true;
    this.recept_service.GetPlanningCabinetAll().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPlanningCabinet = data;
      this.onRowUnselect(event);

    })
  }
  GetAllPlanningCabinetActif() {
    this.IsLoading = true;
    this.recept_service.GetPlanningCabinetByActif(true).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.dateDisponibleRechercheAu = "";
      this.dateDisponibleRechercheDu = "";
      // this.activeItem?.['value'] === true;

      this.IsLoading = false;
      this.dataPlanningCabinet = data;
      this.onRowUnselect(event);

    })
  }
  GetAllPlanningCabinetInactif() {
    this.IsLoading = true;
    this.recept_service.GetPlanningCabinetByActif(false).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPlanningCabinet = data;
      this.onRowUnselect(event);

    })
  }


  DetailsPlanning = new Array<any>();
  GetPlanningCabinetByCode(code: number) {
    this.IsLoading = true;
    this.recept_service.GetPlanningCabinetByCode(code).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      const details = {
        code: data.codeMedecin, // You'll need a function to generate unique codes
        nomIntervAr: data.medecinDTO.nomIntervAr,  // Assuming your selectedMedecins object has a 'nomMedecin' property
        dateDispo: data.dateExiste,
        nbrePlaceDispo: data.nbrePlaceDispo // Assuming dateNaissanceNew is in a suitable format
      };
      this.ListPlanningCabinetTabel.push(details);
    })
  }

  CloseModal() {
    this.visDelete = false;
  }


  dataCabinet = new Array<any>();
  listCabinetPushed = new Array<any>();
  GetAllCabinetActif() {
    this.param_service.GetCabinetByActif(true).subscribe((data: any) => {
      this.dataCabinet = data;
      this.listCabinetPushed = [];
      for (let i = 0; i < this.dataCabinet.length; i++) {
        this.listCabinetPushed.push({ label: this.dataCabinet[i].designationAr, value: this.dataCabinet[i].code })
      }
      this.ListCabinet = this.listCabinetPushed;
    })
  }




  ListMedecinPushed = new Array<any>();
  GetMedecinForPlanningOPD() {
    this.param_service.GetMedecinActifAndHaveConsultationOpdAndER(true, false).subscribe((data: any) => {
      this.dataMedecin = data;
      this.ListMedecinPushed = [];
      for (let i = 0; i < this.dataMedecin.length; i++) {
        this.ListMedecinPushed.push({ label: this.dataMedecin[i].nomIntervAr, value: this.dataMedecin[i].code })
      }
      this.ListMedecin = this.ListMedecinPushed;
    })
  }




  formatInputNew(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempNew = inputValue;
    this.tryParseAndSetDateNew(inputValue);
  }
  tryParseAndSetDateNew(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        this.dateDisponible = new Date(year, month, day);
      }
    }
  }
  transformDateFormat() {
    this.dateDisponible = this.datePipe.transform(this.dateDisponible, "yyyy-MM-dd")
  };

  transformDateFormatRechercheAu() {
    this.dateDisponibleRechercheAu = this.datePipe.transform(this.dateDisponibleRechercheAu, "yyyy-MM-dd")
  };
  formatInputNewRechercheAu(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempNewRechercheAu = inputValue;
    this.tryParseAndSetDateNewRechercheAu(inputValue);
  }
  tryParseAndSetDateNewRechercheAu(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        this.dateDisponibleRechercheAu = new Date(year, month, day);
      }
    }
  }


  transformDateFormatRechercheDu() {
    console.log("v1");
    this.dateDisponibleRechercheDu = this.datePipe.transform(this.dateDisponibleRechercheDu, "yyyy-MM-dd")
  };
  formatInputNewRechercheDu(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempNewRechercheDu = inputValue;
    this.tryParseAndSetDateNewRechercheDu(inputValue);
  }
  tryParseAndSetDateNewRechercheDu(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        this.dateDisponibleRechercheDu = new Date(year, month, day);
      }
    }
  }


  onRowUnselectFromTabsPlanning(event: any) {
    this.SelectedPlanningRow = null;
  }

  onRowSelectFromTabsPlanning(event: any) {
    console.log("Ok Planning", event.data);

  }

  public remove(index: number): void {
    this.ListPlanningCabinetTabel.splice(index, 1);
    console.log(index);
  }

  btnAddToPlanningClicked() {
    // Check if all required fields are filled
    if (!this.selectedMedecins || !this.dateDisponible || !this.NbrePlaceDisponible) {
      // Handle the error appropriately, e.g., display a message to the user
      console.error('Please fill in all required fields.');
      return;
    }


    const selectedMedecin = this.dataMedecin.find(m => m.code === this.selectedMedecins);


    // Check for duplicate date before adding the new row
    const dateAlreadyExists = this.ListPlanningCabinetTabel.some(
      (item) => item.dateDispo === this.dateDisponible && item.code === this.selectedMedecins
    );

    if (dateAlreadyExists) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('PlanningDejaExisteWithThisMedecin');

      return;


    }



    const newRow = {
      code: this.selectedMedecins, // You'll need a function to generate unique codes
      nomIntervAr: selectedMedecin ? selectedMedecin.nomIntervAr : 'Unknown',  // Assuming your selectedMedecins object has a 'nomMedecin' property
      nbrePlaceDispo: this.NbrePlaceDisponible,
      dateDispo: this.dateDisponible // Assuming dateNaissanceNew is in a suitable format
    };

    this.ListPlanningCabinetTabel.push(newRow);
    this.dateDisponible = "";
    this.NbrePlaceDisponible = "";
    this.disbledMedecinSelected = true;
  }



  RechercherPlanningParDateBetween() {

    if (this.dateDisponibleRechercheAu == "" || this.dateDisponibleRechercheDu == "") {

      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('PleaseChooseAnyDate');

    } else {



      if (this.activeItem?.['value'] == undefined) {
        this.recept_service.GetPlanningCabinetByDateExiste(this.dateDisponibleRechercheDu, this.dateDisponibleRechercheAu).subscribe({
          next: (data: any) => {
            this.loadingComponent.IsLoading = false;
            this.IsLoading = false;
            this.dataPlanningCabinet = data;
          },
          error: (err) => {
            console.error('Error fetching planning data:', err);
            this.IsLoading = false; // Ensure loading indicator turns off even on error
            this.CtrlAlertify.showNotificationِCustom('Erreur lors de la recherche');
          }
        });
      } else {
        this.recept_service.GetPlanningCabinetByActifAndDateExiste(this.activeItem?.['value'], this.dateDisponibleRechercheDu, this.dateDisponibleRechercheAu).subscribe({
          next: (data: any) => {
            this.loadingComponent.IsLoading = false;
            this.IsLoading = false;
            this.dataPlanningCabinet = data;
          },
          error: (err) => {
            console.error('Error fetching planning data:', err);
            this.IsLoading = false; // Ensure loading indicator turns off even on error
            this.CtrlAlertify.showNotificationِCustom('Erreur lors de la recherche');
          }
        });
      }


    }

  }
 
  
}






