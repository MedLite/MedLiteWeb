import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { ParametargeService } from '../ServiceClient/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';


declare const PDFObject: any;
@Component({
  selector: 'app-type-intervenant',
  templateUrl: './type-intervenant.component.html',
  styleUrls: ['./type-intervenant.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class TypeIntervenantComponent implements OnInit {
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;

  first = 0;
  IsLoading = true;
  openModal!: boolean;

  constructor(public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify) {
  }



    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
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
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string; 

  userCreate = sessionStorage.getItem("userName");
  dataTypeIntervenant = new Array<any>();
  compteur: number = 0;
  selectedTypeIntervenant!: any;




  ngOnInit(): void {
    this.items = [
      { label: this.i18nService.getString('LabelActif') || 'LabelActif', icon: 'pi pi-file-check', command: () => { this.GetAllTypeIntervenantActif() } },
      { label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel', command: () => { this.GetAllTypeIntervenantInactif() } },
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file', command: () => { this.GetAllTypeIntervenant() } },
    ];
    this.activeItem = this.items[0];

    this.GetColumns();
    this.GetAllTypeIntervenantActif();


  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisieTypInterv").
      subscribe((data: any) => {
        this.codeSaisie = data.prefixe + data.suffixe;
      })
  }


  GetColumns() {
    this.cols = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '16%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '16%', filter: "false" },
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
    this.selectedTypeIntervenant = '' 
    this.onRowUnselect(event);

  }





  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif; 
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
  }
  onRowUnselect(event: any) {
    this.code = event.data = null;
  }



  DeleteTypeIntervenant(code: any) {
    this.param_service.DeleteTypeIntervenant(code).subscribe(
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
      this.GetCodeSaisie();
      this.clearForm();
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
        this.formHeader = "Imprimer Liste TypeIntervenant"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    return codeSaisie && designationAr && designationLt;
  }



  PostTypeIntervenant() {

    const isValid = this.validateAllInputs();
    if (isValid) {
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif, 

      }
      if (this.code != null) {
        body['code'] = this.code;

        this.param_service.UpdateTypeIntervenant(body).subscribe(

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
        this.param_service.PostTypeIntervenant(body).subscribe(
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











  GetAllTypeIntervenant() {
    this.IsLoading = true;  
    this.param_service.GetTypeIntervenant().subscribe((data: any) => { 
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false; 
      this.dataTypeIntervenant = data;
      this.onRowUnselect(event);

    })
  }
  
  GetAllTypeIntervenantActif() {
    this.IsLoading = true;  
    this.param_service.GetTypeIntervenantActifAndVirtuel(true).subscribe((data: any) => { 
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false; 
      this.dataTypeIntervenant = data;
      this.onRowUnselect(event);

    })
  }
  
  GetAllTypeIntervenantInactif() {
    this.IsLoading = true;  
    this.param_service.GetTypeIntervenantInActif(false).subscribe((data: any) => { 
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false; 
      this.dataTypeIntervenant = data;
      this.onRowUnselect(event);

    })
  }


  CloseModal() {
    this.visDelete = false;
  }


}



