import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  @ViewChild('societeInput') societeInputElement!: Dropdown;

  first = 0;
  IsLoading = true;
  openModal!: boolean;

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
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string;
  userCreate = sessionStorage.getItem("userName");
  dataPriceList = new Array<any>();
  selectedPriceList!: any;
  selectedSociete!: any;
  expandedRows: any = {};

  TypeRemMaj: any; 

  ngOnInit(): void {
    this.GetColumns();
    this.GetAllPriceList();
  }



  GetColumns() {
    this.cols = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '16%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '16%', filter: "true" },
      { field: 'actif', header: this.i18nService.getString('LabelActif') || 'Actif', width: '16%', filter: "true" },
    ];
  }

  GetColumnsFamilleFacturationTable() {
    this.ColumnsFamilleFacturation = [
      { field: '', header: '', width: '1%', filter: "true" },
      { field: 'familleFacturationDTO.codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '24%', filter: "true" },
      { field: 'familleFacturationDTO.designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '25%', filter: "true" },
      { field: 'familleFacturationDTO.designationLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '25%', filter: "true" },
      { field: 'taux', header: this.i18nService.getString('taux') || 'Taux', width: '25%', filter: "true" },
      { field: 'augRemise', header: this.i18nService.getString('AugRem') || 'AugRem', width: '25%', filter: "true" },
      { field: '',  header: this.i18nService.getString('Applique') || 'CodeSaisie', width: '1%', filter: "true" },
    
    ];

    this.TypeRemMaj=[
      {label:'Remise',value:'REM'},
      {label:'Majoration',value:'MAJ'},
    ]
  }

  GetColumnsPrestationTable() {
    this.ColumnsPrestation = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '10%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '20%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '20%', filter: "false" },
      { field: 'montant', header: this.i18nService.getString('montant') || 'Montant', width: '15%', filter: "true" },
      { field: 'taux', header: this.i18nService.getString('taux') || 'Taux', width: '20%', filter: "true" },
      { field: 'mntAvantMaj', header: this.i18nService.getString('montantAvantMaj') || 'MontantAvantMaj', width: '20%', filter: "true" },
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
        this.CtrlAlertify.showLabel();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit();
        this.visDelete = false;

      }
    )
  }


  public onOpenModal(mode: string) {

    this.LabelActif = this.i18nService.getString('LabelActif');
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
        this.CtrlAlertify.showLabel();
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
        this.CtrlAlertify.showLabel();
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
        this.CtrlAlertify.showLabel();
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




  detailsPriceListsListDTOss:any;
  PostPriceList() {

    this.detailsPriceListsListDTOss = [];

    const priceListData = {
      codeSaisie: 'PL001', // Replace with actual value
      designationAr: 'PriceList 1', // Replace with actual value
      designationLt: 'PriceList 1', // Replace with actual value
      actif: 1,
      userCreate: 'soufiennnPost', // Replace with actual value
      dateCreate: '2024-12-29', // Replace with actual value or use Date()
      codeSociete: '1'  // Replace with actual value
    };


    const isValid = this.validateAllInputs();
    if (isValid) {
    

      this.groupedData.forEach(group => {
        group.prestations.forEach((prestation:any) => {
          // Create entries for each codeNatureAdmission (1, 2, and 3)
          [1, 2, 3].forEach(codeNatureAdmission => { // Iterate over the codes
            this.detailsPriceListsListDTOss.push({
              codeNatureAdmission: codeNatureAdmission.toString(), // Convert to string
              codePrestation: prestation.codeSaisie, // Or however you get codePrestation
              mntAvantMaj: prestation.mntAvantMaj.toString(),
              taux: prestation.taux,
              RemMaj: group.SelectedMajRem,
              userCreate: 'soufiennnPost', // Replace with actual user
              dateCreate: '2024-12-29' // Replace with actual date
            });
          });
        });
      });
      // 3. Combine the data
      const dataToSend = {
        ...priceListData,
        detailsPriceListsListDTOs: this.detailsPriceListsListDTOss
      };
      console.log(JSON.stringify(dataToSend, null, 2)); // Pretty print JSON


      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        dateCreate: new Date().toISOString(), //
        codeSociete: this.selectedSociete,
        code: this.code,
        actif: this.actif,
        cash: 0

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_service.UpdatePriceList(body).subscribe(

          (res: any) => {
            this.CtrlAlertify.showLabel();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.onRowUnselect(event);


          }
        );


      }
      else {
        // this.param_service.PostPriceList(body).subscribe(
        //   (res: any) => {
        //     this.CtrlAlertify.showLabel();
        //     this.CtrlAlertify.ShowSavedOK();
        //     this.visibleModal = false;
        //     this.clearForm();
        //     this.ngOnInit();
        //     this.code;
        //     this.onRowUnselect(event);
        //     this.clearForm();

        //   }
        // )
      }

    } else {
      console.log("Erorrrrrr")
    }





  }











  GetAllPriceList() {
    this.param_service.GetPriceList().subscribe((data: any) => {

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
    this.param_service.GetPrestation().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataPrestation = data; // Keep the original data
      this.groupedData = this.groupPrestationsByFamille(data);

      this.groupedData.forEach(group => {
        group.SelectedMajRem = null; // or a default value if needed
      });

      // console.log("groupeeddd", this.groupedData);
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


  ValeurSelectedMajRem:any;
  MntAvantRemMaj:any;
  tauxRemMaj:any;
  AppliquePourcentageInAllPrestationDisponible(group: any, inputElement: HTMLInputElement) {
    const percentage = parseFloat(inputElement.value); 
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      // Handle invalid percentage input (e.g., show an error message)
      // Assuming you have a translation for this
      this.CtrlAlertify.showLabel();
      this.CtrlAlertify.showNotificationِCustom('InvalidPercentage');
      inputElement.value = ''; // Clear the invalid input
      return;
    } 
    if(group.SelectedMajRem === null || group.SelectedMajRem === undefined ){
        this.CtrlAlertify.showLabel();
       this.CtrlAlertify.showNotificationِCustom('selectTypeRemiseMajoration');
      return;
    }
    group.prestations.forEach((prestation: any) => {
      const originalMontantOPD = prestation.montantOPD;
      const originalMontantER = prestation.montantER;
      const originalMontantIP = prestation.montantIP;
      if (group.SelectedMajRem == "MAJ") { 
        prestation.mntApresMajOPD = originalMontantOPD * (1 + percentage / 100);  
        prestation.mntApresMajER = originalMontantER * (1 + percentage / 100);  
        prestation.mntApresMajIP = originalMontantIP * (1 + percentage / 100);  
      } else if (group.SelectedMajRem == "REM") { 
        prestation.mntApresMajOPD = originalMontantOPD * (1 - percentage / 100); 
        prestation.mntApresMajER = originalMontantER * (1 - percentage / 100); 
        prestation.mntApresMajIP = originalMontantIP * (1 - percentage / 100); 
      }
      prestation.taux = percentage; 
    });
 
  }

  


}







