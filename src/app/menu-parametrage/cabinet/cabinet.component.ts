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
import { ParametargeService } from '../WebService/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { Dropdown } from 'primeng/dropdown';


declare const PDFObject: any;
@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class CabinetComponent implements OnInit {
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('specialiteCabinetInput') specialiteCabinetInputElement!: Dropdown;

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
  dataCabinet = new Array<any>();
  selectedCabinet!: any;
  ListSpecialiteCabinet = new Array<any>();
  selectedSpecialiteCabinet: any = '';

  ngOnInit(): void {
    this.GetColumns();
    this.GelAllCabinet();
  }



  GetColumns() {
    this.cols = [
      { field: 'specialiteCabinetDTO.designationAr', header: this.i18nService.getString('SpecialiteCabinet') || 'SpecialiteCabinet', width: '20%', filter: "true" },

      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '20%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '20%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '20%', filter: "false" },
      { field: 'actif', header: this.i18nService.getString('LabelActif') || 'Actif', width: '20%', filter: "true" },

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
    this.selectedCabinet = ''
    this.selectedSpecialiteCabinet='';
    this.onRowUnselect(event);

  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisieCabinet").
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
    this.selectedSpecialiteCabinet = event.data.specialiteCabinetDTO.code

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteCabinet(code: any) {
    this.param_service.DeleteCabinet(code).subscribe(
      (res: any) => {
        this.CtrlAlertify.showLabel();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit(); 
        this.visDelete = false;

      }
    )
  }
 


  // showRequiredNotification() {
  //   const fieldRequiredMessage = this.i18nService.getString('fieldRequired');  // Default to English if not found
  //   alertifyjs.notify(
  //     `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
  //     fieldRequiredMessage
  //   );
  // }
  // showChoseAnyRowNotification() {
  //   const fieldRequiredMessage = this.i18nService.getString('SelctAnyRow');  // Default to English if not found
  //   alertifyjs.notify(
  //     `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
  //     fieldRequiredMessage
  //   );
  // }

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
      this.GetSpecilaiteCabinet();
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
        this.GetSpecilaiteCabinet();

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
        this.formHeader = "Imprimer Liste Cabinet"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    const spec_Cab = this.validationService.validateDropDownCommun(this.specialiteCabinetInputElement, this.selectedSpecialiteCabinet);
    return codeSaisie && designationAr && designationLt && spec_Cab;
  }



  PostCabinet() {

    const isValid = this.validateAllInputs();
    if (isValid) {
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        codeSpecialiteCabinet: this.selectedSpecialiteCabinet,

        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_service.UpdateCabinet(body).subscribe(

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
        this.param_service.PostCabinet(body).subscribe(
          (res: any) => {
            this.CtrlAlertify.showLabel();
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











  GelAllCabinet() {
    this.param_service.GetCabinet().subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      this.dataCabinet = data;
      this.onRowUnselect(event);

    })
  }


  CloseModal() {
    this.visDelete = false;
  }

 
  dataSpecialiteCabinet = new Array<any>();
  listSpecialiteCabPushed = new Array<any>(); 
  GetSpecilaiteCabinet() {
    this.param_service.GetSpecialiteCabinet() .subscribe((data: any) => {
      this.dataSpecialiteCabinet = data;
      this.listSpecialiteCabPushed = [];
      for (let i = 0; i < this.dataSpecialiteCabinet.length; i++) {
        this.listSpecialiteCabPushed.push({ label: this.dataSpecialiteCabinet[i].designationAr, value: this.dataSpecialiteCabinet[i].code })
      }
      this.ListSpecialiteCabinet = this.listSpecialiteCabPushed;
    })
  }




}


