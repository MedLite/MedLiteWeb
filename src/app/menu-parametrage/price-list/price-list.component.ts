import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableRowExpandEvent } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { ParametargeService } from '../WebService/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { Dropdown } from 'primeng/dropdown';

declare const PDFObject: any;

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})


export class PriceListComponent implements OnInit {
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('pourcentageInput') pourcentageInputElement!: HTMLInputElement;
  @ViewChild('societeInput') societeInputElement!: Dropdown;

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
  MontantTotalAppliquer: number = 0;
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string;
  LabelPrestation !: string;
  LabelOperation !: string;
  userCreate = sessionStorage.getItem("userName");
  dataPriceList = new Array<any>();
  selectedPriceList!: any;
  selectedSociete!: any;
  expandedRows: any = {};

  TypeRemMaj: any;

  ngOnInit(): void {
    this.items = [
      { label: this.i18nService.getString('LabelActif') || 'LabelActif', icon: 'pi pi-file-check', command: () => { this.GetAllPriceListActif() } },
      { label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel', command: () => { this.GetAllPriceListInActif() } },
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file', command: () => { this.GetAllPriceList() } },
    ];
    this.activeItem = this.items[0];

    this.GetColumns();
    this.GetAllPriceList();
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
      { field: 'taux', header: this.i18nService.getString('taux') || 'Taux', width: '25%', filter: "true" },
      { field: 'augRemise', header: this.i18nService.getString('AugRem') || 'AugRem', width: '25%', filter: "true" },
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
      { field: 'montant', header: this.i18nService.getString('montant') || 'Montant', width: '10%', filter: "true" },
      { field: 'taux', header: this.i18nService.getString('taux') || 'Taux', width: '10%', filter: "true" },
      { field: 'RemMaj', header: this.i18nService.getString('RemMaj') || 'RemMaj', width: '10%', filter: "true" },
      // { field: 'RemMajValeur', header: this.i18nService.getString('RemMajValeur') || 'RemMajValeur', width: '1%', filter: "true" },
      { field: 'mntAvantMaj', header: this.i18nService.getString('montantAvantMaj') || 'MontantAvantMaj', width: '10%', filter: "true" },
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
    this.selectedPriceList = ''
    this.selectedSociete = '';
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
    this.selectedSociete = event.data.societeDTO.code;

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeletePriceList(code: any) {
    this.param_service.DeletePriceList(code).subscribe(
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
    this.LabelPrestation = this.i18nService.getString('Prestation');
    this.LabelOperation = this.i18nService.getString('Operation');
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

      this.GetColumnsFamilleFacturationTable();
      this.GetColumnsPrestationTable();
      this.clearForm();
      this.GetCodeSaisie();
      this.GetSociete();
      this.GetAllPrestation();

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
        this.GetSociete();

        this.GetAllPrestation();
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
        this.formHeader = "Imprimer Liste SpecialitePriceList"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    const societe = this.validationService.validateDropDownCommun(this.societeInputElement, this.selectedSociete);

    return codeSaisie && designationAr && designationLt && societe;
  }




  detailsPriceListsListDTOss: any;
  PostPriceList() {

    this.detailsPriceListsListDTOss = [];
 
    const isValid = this.validateAllInputs();
    if (isValid) {


      this.groupedData.forEach(group => {
        group.prestations.forEach((prestation: any) => { 

          this.detailsPriceListsListDTOss.push({
            
            codePrestation: prestation.code, // Or however you get codePrestation
            montant: prestation.mntApresMaj,
            montantPere: prestation.prixPrestation,
            taux: prestation.taux,
            remMaj: prestation.RemMajValeur,
            userCreate: this.userCreate,
            dateCreate: new Date().toISOString(), //
            codeNatureAdmission: prestation.codeNatureAdmission,
            codeTypeIntervenant: prestation.codeTypeIntervenant,
          });
        });
      }); 
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        dateCreate: new Date().toISOString(), //
        codeSociete: this.selectedSociete,
        code: this.code,
        actif: this.actif,
        cash: 0,
        detailsPriceLists: this.detailsPriceListsListDTOss

      }
      if (this.code != null) {
        body['code'] = this.code;

        // this.param_service.UpdatePriceList(body).subscribe(

        //   (res: any) => {
        //     this.CtrlAlertify.PostionLabelNotification();
        //     this.CtrlAlertify.ShowSavedOK();
        //     this.visibleModal = false;
        //     this.clearForm();
        //     this.ngOnInit();
        //     this.onRowUnselect(event);


        //   }
        // );


      }
      else {
        // console.log("data Price List Body " , body);
        this.IsLoading=true;
        this.param_service.PostPriceListNew(body).subscribe(
          (res: any) => {
            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.IsLoading=false;
            this.clearForm();
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



  PostPriceLists() {
    this.detailsPriceListsListDTOss = [];
  
    const isValid = this.validateAllInputs();
    if (isValid) {
      this.groupedData.forEach(group => {
        group.prestations.forEach((prestation: any) => {
          this.detailsPriceListsListDTOss.push({
            codePrestation: prestation.code,
            montant: prestation.mntApresMaj,
            montantPere: prestation.prixPrestation,
            remMaj: prestation.RemMajValeur,
            userCreate: this.userCreate,
            dateCreate: new Date().toISOString(), //
            codeNatureAdmission: prestation.codeNatureAdmission,
            codeTypeIntervenant: prestation.codeTypeIntervenant,
          });
        });
      });
  
      const priceListBody = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        dateCreate: new Date().toISOString(), //
        codeSociete: this.selectedSociete,
        code: this.code,
        actif: this.actif,
        cash: 0,
        detailsPriceLists:this.detailsPriceListsListDTOss
      };
  
      this.IsLoading = true;
      const apiCall = this.code === null
        ? this.param_service.PostPriceListNew(priceListBody)
        : this.param_service.UpdatePriceList(priceListBody);
  
      apiCall.subscribe({
        next: (res: any) => {
          this.CtrlAlertify.PostionLabelNotification();
          this.CtrlAlertify.ShowSavedOK();
          this.visibleModal = false;
          this.IsLoading = false;
          this.clearForm();
          this.ngOnInit();
          this.onRowUnselect; //remove event parameter
        },
        error: (error) => {
          this.IsLoading = false;
          console.error('Error:', error);
          // Add more robust error handling here (e.g., display user-friendly error messages)
        }
      });
    } else {
      console.log("Error: Invalid Inputs");
    }
  }








  GetAllPriceList() {
    this.IsLoading = true;
    this.param_service.GetPriceList().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPriceList = data;
      this.onRowUnselect(event);
    })
  }

  GetAllPriceListActif() {
    this.IsLoading = true;
    this.param_service.GetPriceListActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPriceList = data;
      this.onRowUnselect(event);
    })
  }

  GetAllPriceListInActif() {
    this.IsLoading = true;
    this.param_service.GetPriceListInActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPriceList = data;
      this.onRowUnselect(event);
    })
  }


  CloseModal() {
    this.visDelete = false;
  }


  ListSocieteRslt = new Array<any>();
  dataSociete = new Array<any>();
  listSocietePushed = new Array<any>();
  GetSociete() {
    this.param_service.GetSociete().subscribe((data: any) => {
      this.dataSociete = data;
      this.listSocietePushed = [];
      for (let i = 0; i < this.dataSociete.length; i++) {
        this.listSocietePushed.push({ label: this.dataSociete[i].designationAr, value: this.dataSociete[i].code })
      }
      this.ListSocieteRslt = this.listSocietePushed;
    })
  }

  dataPrestation: any[] = [];
  groupedData = new Array<any>();
  GetAllPrestation() {
    this.IsLoading = true;
    this.param_service.GetPrestationByActif(true).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPrestation = data;
      this.groupedData = this.groupPrestationsByFamille(data);

      this.groupedData.forEach(group => {
        group.SelectedMajRem = null;
      });
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

    this.applyPercentageToAll(this.groupedData, percentageValue, this.pourcentageValueGrouped);
  }
  applyPercentageToAll(groups: any[], percentage: number, majRemType: string) {
    if (!majRemType) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('selectTypeRemiseMajoration');
      return;
    }

    groups.forEach(group => {
      this.applyPercentageToGroup(group, percentage, majRemType);
    });
  }

  applyPercentageToGroup(group: any, percentage: number, majRemType: string) {
    group.prestations.forEach((prestation: any) => {
      const originalMontantOPD = prestation.prixPrestation;

      const multiplier = majRemType === 'MAJ' ? (1 + percentage / 100) : (1 - percentage / 100);

      prestation.mntApresMaj = (originalMontantOPD * multiplier).toFixed(3);
      prestation.taux = percentage;
      group.SelectedMajRem = majRemType;
      group.pourcentage = percentage;
      if (majRemType === 'MAJ') {
        prestation.RemMaj = this.i18nService.getString('Majoration') || 'Majoration';
        prestation.RemMajValeur = 'MAJ';
      } else {
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
    if (group.SelectedMajRem === null || group.SelectedMajRem === undefined) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('selectTypeRemiseMajoration');
      return;
    }
    group.prestations.forEach((prestation: any) => {
      const originalMontant = prestation.prixPrestation; // Use the correct original price field
      let newPrice: number;

      if (group.SelectedMajRem === "MAJ") {
        newPrice = originalMontant * (1 + percentage / 100);
        prestation.RemMaj = this.i18nService.getString('Majoration') || 'Majoration';
        prestation.RemMajValeur = 'MAJ';
      } else if (group.SelectedMajRem === "REM") {
        newPrice = originalMontant * (1 - percentage / 100);
        prestation.RemMaj = this.i18nService.getString('Remise') || 'Remise';
        prestation.RemMajValeur = 'REM';
      } else {
        // Handle unexpected majRemType
        return;
      }

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

    if (prestation.mntApresMaj < originalMontantOPD) {
      prestation.RemMaj = this.i18nService.getString('Remise') || 'Remise';
      prestation.RemMajValeur = 'REM';
    } else {
      prestation.RemMaj = this.i18nService.getString('Majoration') || 'Majoration';
      prestation.RemMajValeur = 'MAJ';
    }
  }

}







