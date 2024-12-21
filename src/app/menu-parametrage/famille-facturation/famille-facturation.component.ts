import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
 

declare const PDFObject: any;
@Component({
  selector: 'app-famille-facturation',
  templateUrl: './famille-facturation.component.html',
  styleUrls: ['./famille-facturation.component.css','.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class FamilleFacturationComponent implements OnInit {
  @ViewChild('codeError') codeErrorElement!: ElementRef; 
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('DesignationArInput') DesignationArInputElement!: ElementRef;
  @ViewChild('DesignationLtInput') DesignationLtInputElement!: ElementRef; 


  IsLoading = true;
  openModal!: boolean;

  constructor(public i18nService: I18nService, private validationService: InputValidationService, private router: Router, private loadingComponent: LoadingComponent, private confirmationService: ConfirmationService, private messageService: MessageService, private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {


  }

  validateCodeSaisieInput() {
    this.validationService.validateInput(this.codeSaisieInputElement, this.codeErrorElement, this.codeSaisie, 'codeSaisie');
  }
  validateDesignationArInput() {
    this.validationService.validateInput(this.DesignationArInputElement, this.codeErrorElement, this.designationAr, 'DesignationAr');
  }

  validateDesignationLtInput() {
    this.validationService.validateInput(this.DesignationArInputElement, this.codeErrorElement, this.designationAr, 'DesignationAr');
  }
 

  @ViewChild('modal') modal!: any;

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];

  check_actif = false;
  check_inactif = false;
  formHeader = ".....";
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any;
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  rib!: string;
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string;
  userCreate = "soufien";
  dataBanque = new Array<any>();
  compteur: number = 0;
  listDesig = new Array<any>();
  selectedBanque!: any;
  ListFamilleFacturation = new Array<any>();
  selectedFamilleFacturation: any = '';
  ListFamillePrestation = new Array<any>();
  selectedFamillePrestation: any = '';





  ngOnInit(): void {
    this.GetColumns();
    this.GelAllBanque();
    this.ListFamilleFacturation = [
      { label: 'Famill Fact 1', value: '1' },
      { label: 'Famille Fact 2', value: '2' },
      { label: 'Famille Fact 3', value: '3' },
    ];

    this.ListFamillePrestation = [
      { label: 'Famill Pres 1', value: '1' },
      { label: 'Famille Pres 2', value: '2' },
      { label: 'Famille Pres 3', value: '3' },
    ]

  }



  GetColumns() {
    this.cols = [
      { field: 'TypeOP', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '5%', filter: "true" },
      { field: 'SourceDepenese', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '5%', filter: "true" },
      { field: 'codeEtatApprouver', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '5%', filter: "false" },
      { field: 'dateCreate', header: this.i18nService.getString('LabelActif') || 'Actif', width: '5%', filter: "true" },

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
    this.onRowUnselect(event);




  }
  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    this.rib = event.data.rib;

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteBanque(code: any) {
    // this.param_service.DeleteBanque(code) .subscribe(
    //   (res:any) => {
    //     alertifyjs.set('notifier', 'position', 'top-left');
    //     alertifyjs.success('<i class="success fa fa-chevron-down" aria-hidden="true" style="margin: 5px 5px 5px;font-size: 15px !important;;""></i>' + "Success Deleted");

    //     this.ngOnInit();
    //     this.check_actif = true;
    //     this.check_inactif = false;
    // this.visDelete = false;

    //   }
    // )
  }
  clearSelected(): void {
    this.code == undefined;
    this.codeSaisie = '';
    this.designationAr = '';
    this.designationLt = '';
    this.actif = false;
    this.visible = false;
  }


  showRequiredNotification() {
    const fieldRequiredMessage = this.i18nService.getString('fieldRequired');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }
  showChoseAnyRowNotification() {
    const fieldRequiredMessage = this.i18nService.getString('SelctAnyRow');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
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
      this.clearSelected();
      this.actif = false;
      this.visible = false;
      this.visibleModal = true;
      this.code == undefined;


    }
    if (mode === 'edit') {


      if (this.code == undefined) {
        this.clearForm();
        this.onRowUnselect(event);
        if (sessionStorage.getItem("lang") == "ar") {
          alertifyjs.set('notifier', 'position', 'top-left');
        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
        }

        this.showChoseAnyRowNotification();
        this.visDelete == false && this.visibleModal == false
      } else {

        button.setAttribute('data-target', '#Modal');
        this.formHeader = this.i18nService.getString('Modifier');

        this.visibleModal = true;
        this.onRowSelect;

      }

    }

    if (mode === 'Delete') {

      if (this.code == undefined) {
        this.onRowUnselect;
        if (sessionStorage.getItem("lang") == "ar") {
          alertifyjs.set('notifier', 'position', 'top-left');
        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
        }

        this.showChoseAnyRowNotification();
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
        if (sessionStorage.getItem("lang") == "ar") {
          alertifyjs.set('notifier', 'position', 'top-left');
        } else {
          alertifyjs.set('notifier', 'position', 'top-right');
        }

        this.showChoseAnyRowNotification();
        this.visDelete == false && this.visibleModal == false && this.visibleModalPrint == false
      } else {
        button.setAttribute('data-target', '#ModalPrint');
        this.formHeader = "Imprimer Liste Banque"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }

  // datecreate !: Date;
  // currentDate = new Date();

  // ajusterHourAndMinutes() {
  //   let hour = new Date().getHours();
  //   let hours;
  //   if (hour < 10) {
  //     hours = '0' + hour;
  //   } else {
  //     hours = hour;
  //   }
  //   let min = new Date().getMinutes();
  //   let mins;
  //   if (min < 10) {
  //     mins = '0' + min;
  //   } else {
  //     mins = min;
  //   }
  //   return hours + ':' + mins
  // }
  // datform = new Date();

  PostBanque() {



    this.validateCodeSaisieInput();
    this.validateDesignationArInput();
    this.validateDesignationLtInput(); 



    if (!this.designationAr || !this.designationLt || !this.codeSaisie  ) {
      if (sessionStorage.getItem("lang") == "ar") {
        alertifyjs.set('notifier', 'position', 'top-left');
      } else {
        alertifyjs.set('notifier', 'position', 'top-right');
      }

      this.showRequiredNotification();
    } else {


      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        rib: this.rib,

        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif, 

      }
      if (this.code != null) {
        body['code'] = this.code;

        // this.param_service.UpdateBanque(body) .subscribe(

        //   (res: any) => {
        //      if(sessionStorage.getItem("lang") == "ar"){
        //   alertifyjs.set('notifier', 'position', 'top-left');
        // }else{
        //   alertifyjs.set('notifier', 'position', 'top-right');
        // }

        //                 alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/files/images/ok.png" alt="image" >' + "تم التحيين");

        //     this.visibleModal = false;
        //     this.clearForm();
        //     this.ngOnInit();
        //     this.check_actif = true;
        //     this.check_inactif = false;
        //     this.onRowUnselect(event);
        //     this.clearSelected();

        //   }
        // );


      }
      else {
        // this.param_service.PostBanque(body) .subscribe(
        //   (res:any) => {
        //     alertifyjs.set('notifier', 'position', 'top-left'); 
        //     alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/files/images/ok.png" alt="image" >' + "تم الحفظ بنجاح");
        //     this.visibleModal = false;
        //     this.clearForm();
        //     this.ngOnInit();
        //     this.code;
        //     this.check_actif = true;
        //     this.check_inactif = false;
        //     this.onRowUnselect(event);
        //     this.clearSelected();

        //   }
        // )
      }
    }

  }


  Voids(): void {
    // this.cars = [

    // ].sort((car1, car2) => {
    //   return 0;
    // });

  }



  public remove(index: number): void {
    this.listDesig.splice(index, 1);
    console.log(index);
  }








  GelAllBanque() {
    // this.param_service.GetBanque().subscribe((data: any) => {

    this.loadingComponent.IsLoading = false;
    this.IsLoading = false;

    //   this.dataBanque = data;
    //   this.onRowUnselect(event);

    // }) 
  }




}



