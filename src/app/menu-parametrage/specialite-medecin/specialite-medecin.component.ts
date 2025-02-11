import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { ParametargeService } from '../ServiceClient/parametarge.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';

declare const PDFObject: any;
@Component({
  selector: 'app-specialite-medecin',
  templateUrl: './specialite-medecin.component.html',
  styleUrls: ['./specialite-medecin.component.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [ConfirmationService, MessageService, InputValidationService, ControlServiceAlertify]
})
export class SpecialiteMedecinComponent implements OnInit {

  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('desginationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('desginationLtInput') desginationLtInputElement!: ElementRef;
  @ViewChild('ribInput') ribInputInputElement!: ElementRef;

  first = 0;
  IsLoading = true;
  openModal!: boolean;
  pdfData!: Blob;
  // isLoading = false;
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
  selectedSpecialiteMedecin!: any;
  LabelActif!: string;

  userCreate = sessionStorage.getItem("userName");
  dataSpecialiteMedecin = new Array<any>(); 

  constructor(public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify) {
  }

  @ViewChild('modal') modal!: any;


  ngOnInit(): void {
    this.GetColumns();
    this.GetAllSpecialiteMedecin();
  }

  GetColumns() {
    this.cols = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '20%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '20%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '20%', filter: "false" },
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
    this.param_service.GetCompteur("CodeSaisieSpMdecin").
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
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.selectedSpecialiteMedecin = '';
    this.code = event.data = null;
  }



  DeleteSpecialiteMedecin(code: any) {
    this.param_service.DeleteSpecialiteMedecin(code).subscribe(
      (res: any) => {
        this.CtrlAlertify.PostionLabelNotification();
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
      this.clearForm();
      this.GetCodeSaisie();
      this.actif = false;
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
        this.formHeader = "Imprimer Liste SpecialiteMedecin"
        this.visibleModalPrint = true;
        // this.RemplirePrint();
      }
    }

  }


  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.desginationLtInputElement, this.designationLt);
    return codeSaisie && designationAr && designationLt ;
  }



  PostSpecialiteMedecin() {
    const isValid = this.validateAllInputs();
    if (isValid) {
      let body = {
        codeSaisie: this.codeSaisie,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        userCreate: this.userCreate,
        dateCreate: new Date().toISOString(),
        code: this.code,
        actif: this.actif,
      }
      if (this.code != null) {
        body['code'] = this.code;
        this.param_service.UpdateSpecialiteMedecin(body).subscribe(
          (res: any) => {
            this.CtrlAlertify.PostionLabelNotification();
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
        this.param_service.PostSpecialiteMedecin(body).subscribe(
          (res: any) => {
            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.code;
            this.onRowUnselect(event);
            this.clearSelected();
          }
        )
      }
    } else {
      console.log("Erorrrrrr")
    }
  }


  GetAllSpecialiteMedecin() {
    this.param_service.GetSpecialiteMedecin().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataSpecialiteMedecin = data;
      this.onRowUnselect(event);
    })
  }
  CloseModal() {
    this.visDelete = false;
  }


}


