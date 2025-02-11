import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { ParametargeService } from '../ServiceClient/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
 

declare const PDFObject: any;
@Component({
  selector: 'app-type-operation',
  templateUrl: './type-operation.component.html',
  styleUrls: ['./type-operation.component.css','.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class TypeOperationComponent implements OnInit {
 
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
 
   
 
   @ViewChild('modal') modal!: any;
 
   pdfData!: Blob;
   isLoading = false;
   cols!: any[];
    items: MenuItem[] | undefined;
    activeItem: MenuItem | undefined;
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
   dataTypeOperation = new Array<any>();
   compteur: number = 0;
   listDesig = new Array<any>();
   selectedTypeOperation!: any;
   ListFamilleFacturation = new Array<any>();
   selectedFamilleFacturation: any = '';
   ListTypeTypeOperation = new Array<any>(); 
   selectedTypeTypeOperation : any = '';
   ListDevise = new Array<any>(); 
   selectedDevise : any = '';
 
 
 
 
   ngOnInit(): void {
    this.items = [
      { label: this.i18nService.getString('LabelActif') || 'LabelActif', icon: 'pi pi-file-check', command: () => { this.GetAllTypeOperationActif() } },
      { label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel', command: () => { this.GetAllTypeOperationInActif() } },
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file', command: () => { this.GetAllTypeOperation() } },
    ];
    this.activeItem = this.items[0];
     this.GetColumns();
     this.GetAllTypeOperationActif();
     
 
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
      this.selectedTypeOperation = '' 
      this.onRowUnselect(event);
  
    }
  
  
    GetCodeSaisie() {
      this.param_service.GetCompteur("CodeSaisieTypeOperation").
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
    }
    onRowUnselect(event: any) { 
      this.code = event.data = null;
    }
  
  
  
    DeleteTypeOperation(code: any) {
      this.param_service.DeleteTypeOperation(code).subscribe(
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
        this.formHeader = this.i18nService.getString('Add') +' ' +this.i18nService.getString('TypeOperation')  ;
        this.onRowUnselect(event);
   
        this.clearForm();
        this.GetCodeSaisie();   
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
          this.formHeader = this.i18nService.getString('Modifier')  +' ' +this.i18nService.getString('TypeOperation')  ;;
    
  
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
            this.formHeader = this.i18nService.getString('Delete')  +' ' +this.i18nService.getString('TypeOperation')  ;;
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
          this.formHeader = "Imprimer Liste TypeOperation"
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
  
  
  
    PostTypeOperation() {
  
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
  
          this.param_service.UpdateTypeOperation(body).subscribe(
  
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
          this.param_service.PostTypeOperation(body).subscribe(
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
  
  
  
  
  
  
  
  
  
  
  
    GetAllTypeOperation() {
      this.IsLoading=true;
      this.param_service.GetTypeOperation().subscribe((data: any) => {
  
        this.loadingComponent.IsLoading = false;
        this.IsLoading = false;
  
        this.dataTypeOperation = data;
        this.onRowUnselect(event);
  
      })
    }

       
    GetAllTypeOperationActif() {
      this.IsLoading=true;
      this.param_service.GetTypeOperationActif(true).subscribe((data: any) => { 
        this.loadingComponent.IsLoading = false;
        this.IsLoading = false; 
        this.dataTypeOperation = data;
        this.onRowUnselect(event);
  
      })
    }

      
    GetAllTypeOperationInActif() {
      this.IsLoading=true;
      this.param_service.GetTypeOperationInActif(false).subscribe((data: any) => { 
        this.loadingComponent.IsLoading = false;
        this.IsLoading = false; 
        this.dataTypeOperation = data;
        this.onRowUnselect(event);
  
      })
    }
  
  
    CloseModal() {
      this.visDelete = false;
    }
  
   
     
  


}



