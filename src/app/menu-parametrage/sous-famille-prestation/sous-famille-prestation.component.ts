import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { Dropdown } from 'primeng/dropdown';
import { ParametargeService } from '../WebService/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';

declare const PDFObject: any;
@Component({
  selector: 'app-sous-famille-prestation',
  templateUrl: './sous-famille-prestation.component.html',
  styleUrls:[ './sous-famille-prestation.component.css','.../../../src/assets/css/newStyle.css'
  , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class SousFamillePrestationComponent implements OnInit {

    @ViewChild('codeError') codeErrorElement!: ElementRef;
    @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
    @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
    @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
    @ViewChild('specialiteSousFamillePrestationInput') specialiteSousFamillePrestationInputElement!: Dropdown;
    @ViewChild('FamillePrestationInput') FamillePrestationInputElement!: Dropdown;
  
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
    dataSousFamillePrestation = new Array<any>();
    selectedSousFamillePrestation!: any; 

    ListFamillePrestation = new Array<any>();
    selectedFamillePrestation: any = '';
  
    ngOnInit(): void {
      this.GetColumns();
      this.GetAllSousFamillePrestation();
    }
  
  
  
    GetColumns() {
      this.cols = [
        { field: 'famillePrestationDTO.designationAr', header: this.i18nService.getString('FamillePrestation') || 'SpecialiteSousFamillePrestation', width: '20%', filter: "true" },
  
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
      this.selectedSousFamillePrestation = '' 
      this.selectedFamillePrestation = '';
      this.onRowUnselect(event);
  
    }
  
  
    GetCodeSaisie() {
      this.param_service.GetCompteur("CodeSaisieSousFamillePrestation").
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
      this.selectedFamillePrestation = event.data.famillePrestationDTO.code
  
      console.log('vtData : ', event);
    }
    onRowUnselect(event: any) {
      console.log('row unselect : ', event);
      this.code = event.data = null;
    }
  
  
  
    DeleteSousFamillePrestation(code: any) {
      this.param_service.DeleteSousFamillePrestation(code).subscribe(
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
        this.GetFamillePrestation();

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
          this.GetFamillePrestation();
  
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
          this.formHeader = "Imprimer Liste SpecialiteSousFamillePrestation"
          this.visibleModalPrint = true;
          // this.RemplirePrint();
  
        }
  
  
  
  
      }
  
    }
  
  
  
    private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
      const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
      const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
      const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
       
      const TypeInterv = this.validationService.validateDropDownCommun(this.FamillePrestationInputElement, this.selectedFamillePrestation);
      
      return codeSaisie && designationAr && designationLt && TypeInterv;
    }
  
  
  
    PostSousFamillePrestation() {
  
      const isValid = this.validateAllInputs();
      if (isValid) {
        let body = {
          codeSaisie: this.codeSaisie,
          designationAr: this.designationAr,
          designationLt: this.designationLt,
          userCreate: this.userCreate, 
          codeFamillePrestation: this.selectedFamillePrestation,
  
          dateCreate: new Date().toISOString(), //
          code: this.code,
          actif: this.actif,
  
        }
        if (this.code != null) {
          body['code'] = this.code;
  
          this.param_service.UpdateSousFamillePrestation(body).subscribe(
  
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
          this.param_service.PostSousFamillePrestation(body).subscribe(
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
  
  
  
  
  
  
  
  
  
  
  
    GetAllSousFamillePrestation() {
      this.param_service.GetSousFamillePrestation().subscribe((data: any) => {
  
        this.loadingComponent.IsLoading = false;
        this.IsLoading = false;
  
        this.dataSousFamillePrestation = data;
        this.onRowUnselect(event);
  
      })
    }
  
  
    CloseModal() {
      this.visDelete = false;
    }
  
    
  

    
    dataFamillePrestation = new Array<any>();
    listFamillePrestationPushed = new Array<any>(); 
    GetFamillePrestation() {
      this.param_service.GetFamillePrestation() .subscribe((data: any) => {
        this.dataFamillePrestation = data;
        this.listFamillePrestationPushed = [];
        for (let i = 0; i < this.dataFamillePrestation.length; i++) {
          this.listFamillePrestationPushed.push({ label: this.dataFamillePrestation[i].designationAr, value: this.dataFamillePrestation[i].code })
        }
        this.ListFamillePrestation = this.listFamillePrestationPushed;
      })
    }
  
  

}







 
