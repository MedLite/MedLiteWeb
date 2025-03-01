import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { ParametargeService } from '../ServiceClient/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { Dropdown } from 'primeng/dropdown';
import { catchError, Observable, throwError } from 'rxjs';

declare const PDFObject: any;

interface OperationDTO {
  code: number;
  codeSaisie: string;
  designationAr: string;
  designationLt: string;
  coutRevient: number;
  mntApresMaj: number; // Added for the table
  // RemMaj: string;      // Added for the table
  pourcentage: any; // Added for the table
  // SelectedMajRem: string; // Added for the table
  // RemMajValeur: string;
  taux: any
}


interface PrestationDTO {
  code: number;
  codeSaisie: string;
  designationAr: string;
  designationLt: string;
  prixPrestation: number;
  mntApresMaj: number; // Added for the table 
  pourcentage: any; // Added for the table
  // SelectedMajRem: string; // Added for the table
  // RemMajValeur: string;
  taux: any
  // ... other properties
}


interface FamilleFacturationDTO {
  code: number;
  codeSaisie: string;
  designationAr: string;
  designationLt: string;
  // ... other properties
}

interface GroupedDataOperation {
  familleCode: number;
  familleFacturationDTO: FamilleFacturationDTO;
  operations: OperationDTO[];
  pourcentage: any; // Added for the table
  // SelectedMajRem: string; // Added for the table
  // RemMajValeur: string;
  taux: any
}

interface GroupedDataPrestation {
  familleCode: number;
  familleFacturationDTO: FamilleFacturationDTO;
  prestations: PrestationDTO[];
  pourcentage: any; // Added for the table
  // SelectedMajRem: string; // Added for the table
  // RemMajValeur: string;
  taux: any
}
@Component({
  selector: 'app-couverture',
  templateUrl: './couverture.component.html',
  styleUrls: ['./couverture.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})

export class CouvertureComponent implements OnInit {
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('pourcentageInput') pourcentageInputElement!: HTMLInputElement;
  @ViewChild('pourcentageOperationInput') pourcentageOperationInputElement!: HTMLInputElement;
  // @ViewChild('societeInput') societeInputElement!: Dropdown;

  first = 0;
  IsLoading = true;
  openModal!: boolean;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  constructor(public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify) {
  }


  @ViewChild('modal') modal!: any;

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];
  ColumnsFamilleFacturation!: any[];
  ColumnsPrestation!: any[];
  formHeader = ".....";
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any;
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  pourcentage: number = 0;
  pourcentageOperation: number = 0;
  MontantTotalAppliquer: number = 0;
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string;
  LabelPrestation !: string;
  LabelGroupedByFamilleFacturation !: string;
  LabelOperation !: string;
  userCreate = sessionStorage.getItem("userName");
  dataListCouverture = new Array<any>();
  selectedListCouverture!: any;
  // selectedSociete!: any;
  expandedRows: any = {};

  TypeRemMaj: any; 
  selectedPriceList: any = '';
  ngOnInit(): void {
    this.initializeTabMenu();
    this.GetColumns();
    this.GetAllListCouvertureActif();
    // this.loadData('actif')
  }


  initializeTabMenu() {
    this.items = [
      { label: this.i18nService.getString('LabelActif') || 'Actif', icon: 'pi pi-file-check', command: () => this.GetAllListCouvertureActif() },
      { label: this.i18nService.getString('LabelInActif') || 'Inactif', icon: 'pi pi-file-excel', command: () => this.GetAllListCouvertureInActif() },
      { label: this.i18nService.getString('LabelAll') || 'Tous', icon: 'pi pi-file', command: () => this.GetAllListCouverture() },
    ];
    this.activeItem = this.items[0];
  }



  GetColumns() {
    this.cols = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '16%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '16%', filter: "true" },
      { field: 'actif', header: this.i18nService.getString('LabelActif') || 'Actif', width: '16%', filter: "true" },
    ];
  }

  GetColumnsFamilleFacturationTable() {
    this.ColumnsFamilleFacturation = [
      { field: '', header: '', width: '1%', filter: "true" },
      { field: 'familleFacturationDTO.codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '24%', filter: "true" },
      { field: 'familleFacturationDTO.designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '25%', filter: "true" },
      { field: 'familleFacturationDTO.designationLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '25%', filter: "true" },
      { field: 'taux', header: this.i18nService.getString('taux') || 'Taux', width: '17%', filter: "true" },
      // { field: 'augRemise', header: this.i18nService.getString('AugRem') || 'AugRem', width: '25%', filter: "true" },
      { field: '', header: this.i18nService.getString('Applique') || 'CodeSaisie', width: '1%', filter: "true" },

    ];

    this.TypeRemMaj = [
      { label: this.i18nService.getString('Remise') || 'Remise', value: 'REM' },
      { label: this.i18nService.getString('Majoration') || 'Majoration', value: 'MAJ' },
    ]
  }

  GetColumnsPrestationTable() {
    this.ColumnsPrestation = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '10%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '25%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '25%', filter: "false" },
      { field: 'montant', header: this.i18nService.getString('MontantTotal') || 'Montant', width: '10%', filter: "true" },
      { field: 'taux', header: this.i18nService.getString('taux') || 'Taux', width: '10%', filter: "true" },
      // { field: 'RemMaj', header: this.i18nService.getString('RemMaj') || 'RemMaj', width: '10%', filter: "true" },
      // { field: 'RemMajValeur', header: this.i18nService.getString('RemMajValeur') || 'RemMajValeur', width: '1%', filter: "true" },
      { field: 'montantPatient', header: this.i18nService.getString('MontantPatient') || 'MontantPatient', width: '10%', filter: "true" },
    ];
  }
  @Output() closed: EventEmitter<string> = new EventEmitter();
  closeThisComponent() {
    const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
    this.closed.emit(parentUrl);
    this.router.navigate([parentUrl]);
  }

  CloseModalPrint() {
    this.visibleModalPrint = false;
  }


  handleRenderPdf(data: any) {
    const pdfObject = PDFObject.embed(data, '#pdfContainer');
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
    this.selectedListCouverture = ''
    // this.selectedSociete = '';
    this.groupedData = new Array<any>();
    this.groupedDataOperation = new Array<any>();
    // this.pourcentageValueGroupedOperation = '';
    this.pourcentageValueGrouped = '';
    this.onRowUnselect(event);

  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisiePL").
      subscribe((data: any) => {
        this.codeSaisie = data.prefixe + data.suffixe;
      })
  }


  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    // this.selectedSociete = event.data.societeDTO.code;

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteListCouverture(code: any) {
    this.IsLoading = true;
    this.param_service.DeleteListCouverture(code) .subscribe(
      (res: any) => {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.ShowDeletedOK();
        this.IsLoading = false;

        this.ngOnInit();
        this.visDelete = false;

      }
     
    )
    this.IsLoading = false;
  }


  public onOpenModal(mode: string) {

    this.LabelActif = this.i18nService.getString('LabelActif');
    this.LabelPrestation = this.i18nService.getString('Prestation');
    this.LabelOperation = this.i18nService.getString('Operation');
    this.LabelGroupedByFamilleFacturation = this.i18nService.getString('LabelGroupedByFamilleFacturation');

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
      this.GetPriceList();
      this.GetColumnsFamilleFacturationTable();
      this.GetColumnsPrestationTable();
      this.clearForm();
      this.GetCodeSaisie(); 
      // this.GetAllPrestation();
      this.GetAllOperationActif();

      this.actif = false;
      this.visible = false;
      this.visibleModal = true;
      this.code == undefined;


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
        // this.GetSociete();
        this.GetColumnsFamilleFacturationTable();
        this.GetColumnsPrestationTable();
        this.GetAllPrestationForModif();
        this.GetAllOperationActifForModif();
        this.GetPriceList();
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
        this.formHeader = "Imprimer Liste SpecialiteListCouverture"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    // const societe = this.validationService.validateDropDownCommun(this.societeInputElement, this.selectedSociete);

    return codeSaisie && designationAr && designationLt;
  }




  detailsListCouverturesListDTOss: any = [];
  detailsListCouverturesListDTOsOperation: any = [];
  PostListCouverture() {


    const isValid = this.validateAllInputs();
    if (isValid) {


      this.groupedData.forEach(group => {
        group.prestations.forEach((prestation: any) => {

          this.detailsListCouverturesListDTOss.push({

            codePrestation: prestation.code, // Or however you get codePrestation
            montantPatient: prestation.mntApresMaj,
            montantPEC: (prestation.prixPrestation - prestation.mntApresMaj),
            montantPere: prestation.prixPrestation,
            tauxCouverPec: prestation.taux,
            userCreate: this.userCreate,
            dateCreate: new Date().toISOString(), //
            codeNatureAdmission: prestation.codeNatureAdmission,
          });
        });
      });

      this.groupedDataOperation.forEach(groupOperation => {
        groupOperation.operations.forEach((operation: any) => {
          this.detailsListCouverturesListDTOsOperation.push({
            codeOperation: operation.code, // Or however you get codePrestation
            montantPEC: (operation.coutRevient - operation.mntApresMaj),
            montantPatient: operation.mntApresMaj,
            montantPere: operation.coutRevient,
            tauxCouverPec: operation.taux,
            userCreate: this.userCreate,
            dateCreate: new Date().toISOString(), // 
            codeTypeIntervenant: operation.codeTypeIntervenant,
          });
        });
      });
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        dateCreate: new Date().toISOString(), //
        // codeSociete: this.selectedSociete,
        code: this.code,
        actif: this.actif,
        cash: 0,
        detailsListCouvertureDTOs: this.detailsListCouverturesListDTOss,
        detailsListCouvertureOperationDTOs: this.detailsListCouverturesListDTOsOperation,

      }
      if (this.code != null) {
        body['code'] = this.code;
        console.log("body to update ", body)
        this.IsLoading = true;
        this.param_service.UpdateListCouverture(body).pipe(
          catchError((error: HttpErrorResponse) => {
            this.IsLoading = false;
            let errorMessage = '';
            this.detailsListCouverturesListDTOss = new Array();
            this.detailsListCouverturesListDTOsOperation = new Array();
            return throwError(errorMessage);

          })
        ).subscribe(

          (res: any) => {

            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.detailsListCouverturesListDTOss = new Array();
            this.detailsListCouverturesListDTOsOperation = new Array();
            this.IsLoading = false;
            this.clearForm();
            this.ngOnInit();
            this.onRowUnselect(event);


          }
        );


      }
      else {
        this.IsLoading = true;
        this.param_service.PostListCouvertureNew(body).pipe(
          catchError((error: HttpErrorResponse) => {
            this.IsLoading = false;
            let errorMessage = '';
            this.detailsListCouverturesListDTOss = new Array();
            this.detailsListCouverturesListDTOsOperation = new Array();
            return throwError(errorMessage);

          })
        ).subscribe(
          (res: any) => {
            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.IsLoading = false;
            this.detailsListCouverturesListDTOss = new Array();
            this.detailsListCouverturesListDTOsOperation = new Array();
            this.ngOnInit();
            this.code;
            this.onRowUnselect(event);
            this.clearForm();

          }
        )
      }

    } else {
      console.log("Erorrrrrr")
    }





  }




  GetAllListCouverture() {
    // this.IsLoading = true;
    this.param_service.GetListCouverture().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataListCouverture = data;
      this.onRowUnselect(event);
    })
  }

  GetAllListCouvertureActif() {
    // this.IsLoading = true;
    this.param_service.GetListCouvertureActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataListCouverture = data;
      this.onRowUnselect(event);
    })
  }

  GetAllListCouvertureInActif() {
    this.IsLoading = true;
    this.param_service.GetListCouvertureInActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataListCouverture = data;
      this.onRowUnselect(event);
    })
  }

  // private ListCouvertureApiCalls: { [key: string]: () => Observable<any> } = {}; 


  loadData(status: 'actif' | 'inactif' | '' = '') {
    this.isLoading = true;
    const apiCall = this.ListCouvertureApiCalls[status];
    if (!apiCall) {
      console.error("Invalid status provided to loadData");
      this.isLoading = false;
      return;
    }

    apiCall().pipe( // Call the function to get the Observable *then* pipe
      // finalize(() => this.isLoading = false),
      // catchError(error => {
      //   this.handleError(error, 'loadData');
      //   return throwError(() => error); 
      // })
    ).subscribe({
      next: (data) => this.dataListCouverture = data,
      error: (err) => {
        // Handle errors more gracefully; don't just log
        console.error("Error in subscribe:", err);
        this.CtrlAlertify.showNotificationِCustom("Failed to load data"); //Example
      }
    });
  }
  get ListCouvertureApiCalls(): { [key: string]: () => Observable<any> } {
    return {
      '': this.param_service.GetListCouverture,
      'actif': this.param_service.GetListCouvertureActif,
      'inactif': this.param_service.GetListCouvertureInActif,
    };
  }

  handleError(error: any, functionName: string) {
    this.isLoading = false;
    console.error(`Error in ${functionName}:`, error);
    this.CtrlAlertify.PostionLabelNotification();
    // this.CtrlAlertify.show();
    // this.CtrlAlertify.showErrorNotification(); // Display a generic error message
  }

  CloseModal() {
    this.visDelete = false;
  }


  // ListSocieteRslt = new Array<any>();
  // dataSociete = new Array<any>();
  // listSocietePushed = new Array<any>();
  // GetSociete() {
  //   this.param_service.GetSocieteActif().subscribe((data: any) => {
  //     this.dataSociete = data;
  //     this.listSocietePushed = [];
  //     for (let i = 0; i < this.dataSociete.length; i++) {
  //       this.listSocietePushed.push({ label: this.dataSociete[i].designationAr, value: this.dataSociete[i].code })
  //     }
  //     this.ListSocieteRslt = this.listSocietePushed;
  //   })
  // }

  dataPrestation: any[] = [];
  groupedData = new Array<any>();
  GetAllPrestation(codePriceList : number) {
    this.IsLoading = true;

    this.param_service.GetDetailsPriceListByCodePriceList(codePriceList).subscribe ( (dataDetailsPriceList:any) => 
    {
      const codePrestationList: number[] = dataDetailsPriceList.map((item: { codePrestation: number }) => item.codePrestation); 
      this.groupedData = this.groupPrestationsByFamille2(dataDetailsPriceList);
      this.IsLoading = false; 
    })
    
  }

  GetAllPrestationForModif() {
    this.IsLoading = true;
    this.param_service.GetDetailsListCouverturePrestationByCodeListCouverture(this.selectedListCouverture.code).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPrestation = data;
      this.groupedData = this.preprocessDataForModifPrestation(data);



    });
  }

  groupPrestationsByFamille(data: any[]): any[] {
    const grouped: { [key: number]: any } = {};
    data.forEach(prestation => {
      const familleCode = prestation.familleFacturationDTO.code; // Correct way to access code
      if (!grouped[familleCode]) {
        grouped[familleCode] = {
          familleCode,
          familleFacturationDTO: prestation.familleFacturationDTO,
          prestations: []
        };
      }
      grouped[familleCode].prestations.push(prestation);
    });
    return Object.values(grouped);
  }
  groupPrestationsByFamille2(data: any[]): any[] {
    const grouped: { [key: number]: any } = {};
    data.forEach(detailsPriceList => {
      const familleCode = detailsPriceList.prestationDTO.familleFacturationDTO.code; // Correct way to access code
      if (!grouped[familleCode]) {
        grouped[familleCode] = {
          familleCode,
          familleFacturationDTO: detailsPriceList.prestationDTO.familleFacturationDTO,
          prestations: [], 
        };
      }
      const prestationWithPrice = { ...detailsPriceList.prestationDTO, prixPrestation: detailsPriceList.mntApresMaj };
      grouped[familleCode].prestations.push(prestationWithPrice);
    });
    return Object.values(grouped);
  }

  getDetailsForPrestation(prestation: any) {
    return prestation.detailsPrestationDTOs || []; // Directly access details from the prestation
  }

  expandAll() {
    this.expandedRows = {};
    this.groupedData.forEach(group => {
      this.expandedRows[group.familleCode] = true; // Expand based on familleCode
    });
  }

  collapseAll() {
    this.expandedRows = {};
  }

  pourcentageValueGrouped: any
  AppliquerPourcenatgeToAll(pource: HTMLInputElement) {
    const percentageValue = parseFloat(pource.value);

    if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('InvalidPercentage');
      return;
    }

    this.applyPercentageToAll(this.groupedData, percentageValue, "REM");
  }
  applyPercentageToAll(groups: any[], percentage: number, majRemType: string) {
    // if (!majRemType) {
    //   this.CtrlAlertify.PostionLabelNotification();
    //   this.CtrlAlertify.showNotificationِCustom('selectTypeRemiseMajoration');
    //   return;
    // }

    groups.forEach(group => {
      this.applyPercentageToGroup(group, percentage, "REM");
    });
  }

  applyPercentageToGroup(group: any, percentage: number, majRemType: string) {
    group.prestations.forEach((prestation: any) => {
      const originalMontantOPD = prestation.prixPrestation;

      // const multiplier = majRemType === 'MAJ' ? (1 + percentage / 100) : (1 - percentage / 100);

      prestation.mntApresMaj = (originalMontantOPD * (1 - percentage / 100)).toFixed(3);
      prestation.taux = percentage;
      group.SelectedMajRem = majRemType;
      group.pourcentage = percentage;
      if (majRemType === 'REM') {
        prestation.RemMaj = this.i18nService.getString('Remise') || 'Remise';
        prestation.RemMajValeur = 'REM';
      }




    });
  }


  ValeurSelectedMajRem: any;
  MntAvantRemMaj: any;
  tauxRemMaj: any;
  AppliquePourcentageInAllPrestationDisponible(group: any, percentage: number) {
    console.log("this.pourcentageValueGrouped   ", this.pourcentageValueGrouped)
    // const percentage = parseFloat(inputElement.value); 
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      // Handle invalid percentage input (e.g., show an error message)
      // Assuming you have a translation for this
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('InvalidPercentage');
      // inputElement.value = ''; // Clear the invalid input
      return;
    }
    // if (group.SelectedMajRem === null || group.SelectedMajRem === undefined) {
    //   this.CtrlAlertify.PostionLabelNotification();
    //   this.CtrlAlertify.showNotificationِCustom('selectTypeRemiseMajoration');
    //   return;
    // }
    group.prestations.forEach((prestation: any) => {
      const originalMontant = prestation.prixPrestation; // Use the correct original price field
      let newPrice: number;
      newPrice = originalMontant * (1 - percentage / 100);
      prestation.RemMaj = this.i18nService.getString('Remise') || 'Remise';
      prestation.RemMajValeur = 'REM';
      prestation.mntApresMaj = parseFloat(newPrice.toFixed(3)); // Apply toFixed(3) here 
      prestation.taux = percentage;

    });

  }

  // ... other code ...

  calculatePercentage(prestation: any) {
    const originalMontantOPD = prestation.prixPrestation; // Use prixPrestation
    if (originalMontantOPD === prestation.mntApresMaj) {
      prestation.taux = 0;
      return;
    }
    // Use Math.abs to get the absolute difference
    prestation.taux = (Math.abs(prestation.mntApresMaj - originalMontantOPD) / originalMontantOPD) * 100;

    if (prestation.mntApresMaj > originalMontantOPD) {
      prestation.mntApresMaj = originalMontantOPD;
      prestation.taux = 0;
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('InvalidMontantCouverture');
    }
  }

  /////// tab operation
  // dataOperation: any[] = [];
  groupedDataOperation = new Array<any>();
  GetAllOperationActif() {
    this.IsLoading = true;
    this.param_service.GetOperationByActif(true).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      // this.dataOperation = data;
      this.groupedDataOperation = this.groupOperationByFamille(data);
      this.groupedDataOperation.forEach(group => {
        group.SelectedMajRem = 'REM';
        group.pourcentage = 0;
        this.AppliquePourcentageInAllOperationDisponible(group, 0);
      });
    });
  }
  GetAllOperationActifForModif() {
    this.IsLoading = true;
    this.param_service.GetDetailsListCouvertureoperationByCodeListCouverture(this.selectedListCouverture.code).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      // this.dataOperation = data;
      this.groupedDataOperation = this.preprocessDataForModifOperation(data); // Handle potential nulls
    });
  }


  groupOperationByFamille(data: any[]): any[] {
    if (!data) return [];
    const grouped: { [key: number]: any } = {};
    data.forEach(operation => {
      const familleCode = operation.familleFacturationDTO?.code; // Correct way to access code
      if (!grouped[familleCode]) {
        grouped[familleCode] = {
          familleCode,
          familleFacturationDTO: operation.familleFacturationDTO,
          operations: []
        };
      }
      grouped[familleCode].operations.push(operation);
    });
    return Object.values(grouped);
  }

  preprocessDataForModifOperation(data: any[]): GroupedDataOperation[] {
    const grouped: { [key: number]: GroupedDataOperation } = {};
    let RemiseMajoration;
    let RemiseMajorationValeur;
    data.forEach(item => {
      if (item.remMaj === "MAJ") {
        RemiseMajoration = this.i18nService.getString('Majoration') || 'Majoration';
        RemiseMajorationValeur = "MAJ";
      } else {
        RemiseMajoration = this.i18nService.getString('Remise') || 'Remise';
        RemiseMajorationValeur = 'REM';
      }
      const operation: OperationDTO = {
        code: item.operationDTO.code,
        codeSaisie: item.operationDTO.codeSaisie,
        designationAr: item.operationDTO.designationAr,
        designationLt: item.operationDTO.designationLt,
        coutRevient: item.operationDTO.coutRevient,
        mntApresMaj: item.montantPatient,
        pourcentage: item.tauxCouverPec,
        taux: item.tauxCouverPec,
      };

      const familleCode = item.operationDTO.familleFacturationDTO.code;
      if (!grouped[familleCode]) {
        grouped[familleCode] = {
          familleCode,
          familleFacturationDTO: item.operationDTO.familleFacturationDTO,
          operations: [],
          pourcentage: item.tauxCouverPec,
          taux: item.tauxCouverPec  // Initialize percentage for the famille
        };
      }
      grouped[familleCode].operations.push(operation);
    });

    return Object.values(grouped);
  }



  preprocessDataForModifPrestation(data: any[]): GroupedDataPrestation[] {

    const grouped: { [key: number]: GroupedDataPrestation } = {};
    let RemiseMajoration;
    let RemiseMajorationValeur;
    data.forEach(item => {
      this.IsLoading = true;


      const prestation: PrestationDTO = {
        code: item.prestationDTO.code,
        codeSaisie: item.prestationDTO.codeSaisie,
        designationAr: item.prestationDTO.designationAr,
        designationLt: item.prestationDTO.designationLt,
        prixPrestation: item.prestationDTO.prixPrestation,
        mntApresMaj: item.montantPatient,
        pourcentage: item.tauxCouverPec,
        taux: item.tauxCouverPec,
      };

      const familleCode = item.prestationDTO.familleFacturationDTO.code;
      if (!grouped[familleCode]) {
        grouped[familleCode] = {
          familleCode,
          familleFacturationDTO: item.prestationDTO.familleFacturationDTO,
          prestations: [],
          pourcentage: item.tauxCouverPec,
          taux: item.tauxCouverPec  // Initialize percentage for the famille
          // SelectedMajRem: RemiseMajorationValeur, // Initialize dropdown value for the famille
        };
      }

      grouped[familleCode].prestations.push(prestation);

    });
    this.IsLoading = false;
    return Object.values(grouped);
  }


  expandAllOperation() {
    this.expandedRows = {};
    this.groupedDataOperation.forEach(group => {
      this.expandedRows[group.familleCode] = true; // Expand based on familleCode
    });
  }

  collapseAllOperation() {
    this.expandedRows = {};
  }

  // pourcentageValueGroupedOperation: any
  AppliquerPourcenatgeToAllOperation(pource: HTMLInputElement) {
    const percentageValue = parseFloat(pource.value);

    if (isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('InvalidPercentage');
      return;
    }

    this.applyPercentageToAllOperation(this.groupedDataOperation, percentageValue, "REM");
  }
  applyPercentageToAllOperation(groups: any[], percentage: number, majRemType: string) {
    // if (!majRemType) {
    //   this.CtrlAlertify.PostionLabelNotification();
    //   this.CtrlAlertify.showNotificationِCustom('selectTypeRemiseMajoration');
    //   return;
    // }

    groups.forEach(group => {
      this.applyPercentageToGroupOperation(group, percentage, "REM");
    });
  }

  applyPercentageToGroupOperation(group: any, percentage: number, majRemType: string) {
    group.operations.forEach((operation: any) => {
      const originalCoutRevient = operation.coutRevient;

      // const multiplier = majRemType === 'REM'  = (1 - percentage / 100);

      operation.mntApresMaj = (originalCoutRevient * (1 - percentage / 100)).toFixed(3);
      operation.taux = percentage;
      group.SelectedMajRem = majRemType;
      group.pourcentage = percentage;
      // if (majRemType === 'MAJ') {
      //   operation.RemMaj = this.i18nService.getString('Majoration') || 'Majoration';
      //   operation.RemMajValeur = 'MAJ';
      // } else {
      //   operation.RemMaj = this.i18nService.getString('Remise') || 'Remise';
      //   operation.RemMajValeur = 'REM';
      // }




    });
  }


  ValeurSelectedMajRemOperation: any;
  MntAvantRemMajOperation: any;
  tauxRemMajOperation: any;
  AppliquePourcentageInAllOperationDisponible(group: any, percentage: number) {
    // console.log("this.pourcentageValueGrouped   ", this.pourcentageValueGroupedOperation)
    // const percentage = parseFloat(inputElement.value); 
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('InvalidPercentage');
      return;
    }
    // if (group.SelectedMajRem === null || group.SelectedMajRem === undefined) {
    //   this.CtrlAlertify.PostionLabelNotification();
    //   this.CtrlAlertify.showNotificationِCustom('selectTypeRemiseMajoration');
    //   return;
    // }
    group.operations.forEach((operation: any) => {
      const originalMontant = operation.coutRevient; // Use the correct original price field
      let newPrice: number;
      newPrice = originalMontant * (1 - percentage / 100);
      operation.RemMaj = this.i18nService.getString('Remise') || 'Remise';
      operation.RemMajValeur = 'REM';
      operation.mntApresMaj = parseFloat(newPrice.toFixed(3)); // Apply toFixed(3) here


      operation.taux = percentage;

    });

  }

  // ... other code ...

  calculatePercentageOperation(operation: any) {
    const originalCoutRevient = operation.coutRevient; // Use prixPrestation
    if (originalCoutRevient === operation.mntApresMaj) {
      operation.taux = 0;
      return;
    }
    // Use Math.abs to get the absolute difference
    operation.taux = ((Math.abs(operation.mntApresMaj - originalCoutRevient) / originalCoutRevient) * 100).toFixed(3);

    if (operation.mntApresMaj > originalCoutRevient) {
      operation.mntApresMaj = originalCoutRevient
      operation.taux = 0
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('InvalidMontantCouverture');
    }
  }



  ListPriceListRslt = new Array<any>();
  dataPriceList = new Array<any>();
  listSocietePushed = new Array<any>();
  GetPriceList() {
    this.param_service.GetPriceListActif().subscribe((data: any) => {
      this.dataPriceList = data;
      this.listSocietePushed = [];
      for (let i = 0; i < this.dataPriceList.length; i++) {
        this.listSocietePushed.push({ label: this.dataPriceList[i].designationAr, value: this.dataPriceList[i].code })
      }
      this.ListPriceListRslt = this.listSocietePushed;
    })
  }

  GetDetailsPriceListWithCodeSociete(codePriceList: number) {
    // this.IsLoading = true;
    this.param_service.GetDetailsPriceListByCodePriceList(codePriceList).subscribe((data: any) => {
      // this.loadingComponent.IsLoading = false;
      // this.IsLoading = false;
      // this.dataPrestation = data;
      // this.groupedData = this.groupPrestationsByFamille(data);
      // this.groupedData.forEach(group => {
      //   group.SelectedMajRem = 'REM';
      //   group.pourcentage = 0;
      //   this.AppliquePourcentageInAllPrestationDisponible(group, 0);
      // });
    });
  }
}







