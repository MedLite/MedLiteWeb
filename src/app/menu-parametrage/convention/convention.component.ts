import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { Dropdown } from 'primeng/dropdown';
import { ParametargeService } from '../ServiceClient/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';

declare const PDFObject: any;

@Component({
  selector: 'app-convention',
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class ConventionComponent implements OnInit {

  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('priceListInput') priceListInputElement!: Dropdown;
  @ViewChild('societeInput') societeInputElement!: Dropdown;

  first = 0;
  IsLoading = true;
  openModal!: boolean;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  constructor(private calandTrans: CalanderTransService, private datePipe: DatePipe, public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify) {
    this.calandTrans.setLangAR();
  }


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
  dataConvention = new Array<any>();
  selectedConvention!: any;
  ListpriceList = new Array<any>();
  selectedpriceList: any = '';

  ListCouverture = new Array<any>();
  selectedCouverture: any = '';

  dateDeb: any;
  dateFin: any;
  ListSociete = new Array<any>();
  selectedSociete: any = '';

  DisabledPL=false;
  DisabledSociete= false;
  DisabledCouverture = false;

  ngOnInit(): void {
    this.items = [
      { label: this.i18nService.getString('LabelActif') || 'LabelActif', icon: 'pi pi-file-check', command: () => { this.GetAllConventionActif() } },
      { label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel', command: () => { this.GetAllConventionInactif() } },
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file', command: () => { this.GetAllConvention() } },
    ];
    this.activeItem = this.items[0];

    this.GetColumns();
    this.GetAllConventionActif();
  }



  GetColumns() {
    this.cols = [
      { field: 'societeDTO.designationAr', header: this.i18nService.getString('Societe') || 'Societe', width: '20%', filter: "true" },

      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '16%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '16%', filter: "false" },
      { field: 'dateDeb', header: this.i18nService.getString('DateDebut') || 'DateDebut', width: '16%', filter: "false" },
      { field: 'dateFin', header: this.i18nService.getString('DateFin') || 'DateFin', width: '16%', filter: "false" },
      { field: 'actif', header: this.i18nService.getString('LabelActif') || 'Actif', width: '16%', filter: "true" },

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
    this.selectedConvention = ''
    this.selectedSociete = '';
    this.selectedCouverture='';
    this.selectedpriceList='';
    this.dateDeb="";
    this.dateFin="";
    this.onRowUnselect(event);

  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisieConvention").
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
    this.selectedCouverture = event.data.listCouvertureDTO.code;
    this.selectedpriceList = event.data.codePriceList;
    this.dateDeb = event.data.dateDeb;
    this.dateFin = event.data.dateFin; 
  }
  onRowUnselect(event: any) {
    // console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteConvention(code: any) {
    this.param_service.DeleteConvention(code).subscribe(
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
      this.GetCodeSaisie();
      this.GetSociete(); 
      this.GetListCouverture();

      this.actif = false;
      this.visible = false;
      this.visibleModal = true;
      this.code == undefined;
      this.DisabledCouverture=false;
      this.DisabledPL=false;
      this.DisabledSociete=false;


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
        this.GetListCouverture(); 
        this.GetPriceListByCodeForModif();
        this.visibleModal = true;
        this.DisabledCouverture=true;
        this.DisabledPL=true;
        this.DisabledSociete=true;
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
        this.formHeader = "Imprimer Liste priceList"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    const spec_Cab = this.validationService.validateDropDownCommun(this.priceListInputElement, this.selectedpriceList);

    const societe = this.validationService.validateDropDownCommun(this.societeInputElement, this.selectedSociete);

    return codeSaisie && designationAr && designationLt && spec_Cab && societe;
  }



  PostConvention() {

    const isValid = this.validateAllInputs();
    if (isValid) {
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        codeSociete: this.selectedSociete,
        dateDeb: this.dateDeb,
        dateFin: this.dateFin,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,
        codeListCouverture: this.selectedCouverture,
        codePriceList: this.selectedpriceList,


      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_service.UpdateConvention(body).subscribe(

          (res: any) => {
            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.onRowUnselect(event);


          }
        );


      }
      else {
        this.param_service.PostConvention(body).subscribe(
          (res: any) => {
            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
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











  GetAllConvention() {
    this.IsLoading = true;
    this.param_service.GetAllConvention().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataConvention = data;
      this.onRowUnselect(event);

    })
  }
  GetAllConventionActif() {
    this.IsLoading = true;
    this.param_service.GetConventionActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataConvention = data;
      this.onRowUnselect(event);

    })
  }
  GetAllConventionInactif() {
    this.IsLoading = true;
    this.param_service.GetConventionInActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataConvention = data;
      this.onRowUnselect(event);

    })
  }


  CloseModal() {
    this.visDelete = false;
  }




  dataSociete = new Array<any>();
  listSocietePushed = new Array<any>();
  GetSociete() {
    this.param_service.GetSocieteActif().subscribe((data: any) => {
      this.dataSociete = data;
      this.listSocietePushed = [];
      for (let i = 0; i < this.dataSociete.length; i++) {
        this.listSocietePushed.push({ label: this.dataSociete[i].designationAr, value: this.dataSociete[i].code })
      }
      this.ListSociete = this.listSocietePushed;
    })
  }




  // GetPristList() {
  
  // }






   




  DateTempNew: any;
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
        let dateObject = new Date(year, month, day); // Create Date object
        this.dateDeb = dateObject; // Assign to your dateDeb property (might be a different type, handle accordingly)
        this.DateTempNew = this.datePipe.transform(dateObject, 'yyyy-MM-dd')!; // Format here
      }
    }
  }
  // transformDateFormatNew() {
  //   if (this.dateDeb) {
  //     this.DateTempNew = this.datePipe.transform(this.dateDeb, 'dd/MM/yyyy')!;
  //   }
  // };




  DateTempNewFin: any;
  formatInputNewFin(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempNewFin = inputValue;
    this.tryParseAndSetDateNewFin(inputValue);
  }

  tryParseAndSetDateNewFin(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        let dateObject = new Date(year, month, day); // Create Date object
        this.dateFin = dateObject; // Assign to your dateDeb property (might be a different type, handle accordingly)
        this.DateTempNew = this.datePipe.transform(dateObject, 'yyyy-MM-dd')!; // Format here
      }
    }
  }
  transformDateFormatNewFin() {
    if (this.dateFin) {
      this.DateTempNewFin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd')!;
    }
  };


  transformDateFormat() {
    this.dateDeb = this.datePipe.transform(this.dateDeb, "yyyy-MM-dd")
  };



  transformDateFormatFin() {
    this.dateFin = this.datePipe.transform(this.dateFin, "yyyy-MM-dd")
  };

  dataPriceList = new Array<any>();
  listPriceListPushed = new Array<any>();
  dataCouverture = new Array<any>();
  listCouverturePushed = new Array<any>();
  GetPriceListAndCouvertureByCodeSociete(codeSociete : number){

    
    this.param_service.GetPriceListByCodeSociete(codeSociete).subscribe((data: any) => {
      this.dataPriceList = data;
      this.listPriceListPushed = [];
      for (let i = 0; i < this.dataPriceList.length; i++) {
        this.listPriceListPushed.push({ label: this.dataPriceList[i].designationAr, value: this.dataPriceList[i].code })
      }
      this.ListpriceList = this.listPriceListPushed;
    }) ;  
  }

  GetListCouverture(){
    this.param_service.GetListCouvertureActif().subscribe((data: any) => {
      this.dataCouverture = data;
      this.listCouverturePushed = [];
      for (let i = 0; i < this.dataCouverture.length; i++) {
        this.listCouverturePushed.push({ label: this.dataCouverture[i].designationAr, value: this.dataCouverture[i].code })
      }
      this.ListCouverture = this.listCouverturePushed;
    })
  }

  GetPriceListByCodeForModif(){
    // this.param_service.GetPriceListByCode(codePriceList).subscribe((data: any) => {
    //   this.dataPriceList = data;
    //   this.listPriceListPushed = [];
    //   for (let i = 0; i < this.dataPriceList.length; i++) {
    //     this.listPriceListPushed.push({ label: this.dataPriceList[i].designationAr, value: this.dataPriceList[i].code })
    //   }
    //   this.ListpriceList = this.listPriceListPushed;
    //   // this.selectedpriceList = this.ListpriceList[0];
     
    // })

    this.param_service. GetPriceList().subscribe((data: any) => {
      this.dataPriceList = data;
      this.listPriceListPushed = [];
      for (let i = 0; i < this.dataPriceList.length; i++) {
        this.listPriceListPushed.push({ label: this.dataPriceList[i].designationAr, value: this.dataPriceList[i].code })
      }
      this.ListpriceList = this.listPriceListPushed; 
    }) ;  


  }

}







