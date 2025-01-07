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
import { Dropdown } from 'primeng/dropdown';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';

declare const PDFObject: any;
@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css','.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
  })

export class FournisseurComponent {
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('typeFournisseurInput') typeFournisseurInputInputElement!: Dropdown;
  @ViewChild('deviseInput') deviseInputInputElement!: Dropdown;

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
   userCreate = sessionStorage.getItem("userName");
  dataFournisseur = new Array<any>();
  compteur: number = 0;
  listDesig = new Array<any>();
  selectedFournisseur!: any;
  ListFamilleFacturation = new Array<any>();
  selectedFamilleFacturation: any = '';
  ListTypeFournisseur = new Array<any>(); 
  selectedTypeFournisseur : any = '';
  ListDevise = new Array<any>(); 
  selectedDevise : any = '';




  ngOnInit(): void {
    this.GetColumns();
    this.GelAllFournisseur();
    

  }



  GetColumns() {
    this.cols = [ 
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '16%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '16%', filter: "false" },
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
     this.selectedFournisseur = '' 
     this.onRowUnselect(event);
 
   }
 
 
   GetCodeSaisie() {
     this.param_service.GetCompteur("CodeSaisieFrs").
       subscribe((data: any) => {
         this.codeSaisie = data.prefixe + data.suffixe;
       })
   }

   getVpriceList() {
    this.param_service.GetVue().
      subscribe((data: any) => { 
        console.log("Vueeee" , data)
      })
  }


  getVpriceListByCode() {
    this.param_service.GetVueByCode(7).
      subscribe((data: any) => { 
        console.log("Vueeee" , data)
      })
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
 
 
 
   DeleteFournisseur(code: any) {
     this.param_service.DeleteFournisseur(code).subscribe(
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
  
       this.clearForm();
       this.GetCodeSaisie(); 
       this.getVpriceList(); 
       this.getVpriceListByCode();
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
         this.formHeader = "Imprimer Liste Fournisseur"
         this.visibleModalPrint = true;
         // this.RemplirePrint();
 
       }
 
 
 
 
     }
 
   }
 
 
 
   private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
     const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
     const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
     const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
     return codeSaisie && designationAr && designationLt  ;
   }
 
 
 
   PostFournisseur() {
 
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
 
         this.param_service.UpdateFournisseur(body).subscribe(
 
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
         this.param_service.PostFournisseur(body).subscribe(
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
 
 
 
 
 
 
 
 
 
 
 
   GelAllFournisseur() {
     this.param_service.GetFournisseur().subscribe((data: any) => {
 
       this.loadingComponent.IsLoading = false;
       this.IsLoading = false;
 
       this.dataFournisseur = data;
       this.onRowUnselect(event);
 
     })
   }
 
 
   CloseModal() {
     this.visDelete = false;
   }
 
  
    
 


}










