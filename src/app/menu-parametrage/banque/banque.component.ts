import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { ParametargeService } from '../WebService/parametarge.service';
import { Dropdown } from 'primeng/dropdown';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';

declare const PDFObject: any;
@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  styleUrls: ['./banque.component.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [ConfirmationService, MessageService, InputValidationService, ControlServiceAlertify]
})
export class BanqueComponent implements OnInit {

  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('desginationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('desginationLtInput') desginationLtInputElement!: ElementRef;
  @ViewChild('ribInput') ribInputInputElement!: ElementRef;


  IsLoading = true;
  openModal!: boolean;
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
  // visible!: boolean;
  selectedBanque!: any;
  LabelActif!: string;
  userCreate = "soufien";
  dataBanque = new Array<any>();
  compteur: number = 0;

  constructor(public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify) {
  }

  @ViewChild('modal') modal!: any;


  ngOnInit(): void {
    this.GetColumns();
    this.GelAllBanque();

  }

  GetColumns() {
    this.cols = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '20%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '20%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '20%', filter: "false" },
      { field: 'rib', header: this.i18nService.getString('Rib') || 'Rib', width: '20%', filter: "false" },
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

  
  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisieBQ").
      subscribe((data: any) => { 
        this.codeSaisie = data.prefixe + data.suffixe;
      })
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
    this.param_service.DeleteBanque(code).subscribe(
      (res: any) => {
        this.CtrlAlertify.showLabel();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit(); 
        this.visDelete = false;

      }
    )
  }
  clearSelected(): void {
    this.code == undefined;
    this.codeSaisie = '';
    this.designationAr = '';
    this.designationLt = '';
    this.actif = false;
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
      this.GetCodeSaisie();
      this.actif = false;
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
        this.CtrlAlertify.showLabel();
        this.CtrlAlertify.showChoseAnyRowNotification();
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
        this.formHeader = "Imprimer Liste Banque"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }


  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.desginationLtInputElement, this.designationLt);
    const rib = this.validationService.validateInputCommun(this.ribInputInputElement, this.rib);
    return codeSaisie && designationAr && designationLt && rib;
  }



  PostBanque() {

    const isValid = this.validateAllInputs();


    if (isValid) {
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        rib: this.rib,
        dateCreate: new Date().toISOString(),
        code: this.code,
        actif: this.actif,
      }
      if (this.code != null) {
        body['code'] = this.code;
        this.param_service.UpdateBanque(body).subscribe(
          (res: any) => {
            this.CtrlAlertify.showLabel();
            this.CtrlAlertify.ShowUpdatedOK();
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.onRowUnselect(event);
            this.clearSelected();

          }
        );


      }
      else {
        this.param_service.PostBanque(body).subscribe(
          (res: any) => {
            this.CtrlAlertify.showLabel();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.code;
            this.check_actif = true;
            this.check_inactif = false;
            this.onRowUnselect(event);
            this.clearSelected();

          }
        )
      }


    } else {
      console.log("Erorrrrrr")
    }







  }


  Voids(): void {
    // this.cars = [

    // ].sort((car1, car2) => {
    //   return 0;
    // });

  }










  // cars!: Array<Matiere>;
  // brands!: SelectItem[];
  // clonedCars: { [s: string]: Matiere } = {}; 

  GelAllBanque() {
    this.param_service.GetBanque().subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      this.dataBanque = data;
      this.onRowUnselect(event);

    })
  }




}


