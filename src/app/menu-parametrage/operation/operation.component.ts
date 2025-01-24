import { HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { Dropdown } from 'primeng/dropdown';
import { ParametargeService } from '../WebService/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { catchError, throwError } from 'rxjs';
import * as _ from 'lodash';
declare const PDFObject: any;


interface DetailsOperationDTO {
  // code:number;
  codeTypeIntervenant: number | null;
  designationArTypeIntervenant: string;
  prixSelonTypeArriver: number;
  userCreate: string;
  dateCreate: string;
}
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})


export class OperationComponent implements OnInit {
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeErrorDrop') codeErrorElementDrop!: Dropdown;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') designationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('familleOperationInput') familleOperationInputElement!: Dropdown;
  @ViewChild('typeOperationInput') typeOperationInputElement!: Dropdown;
  @ViewChild('blocOperationInput') blocOperationInputElement!: Dropdown;
  @ViewChild('familleFacturationInput') familleFacturationInputElement!: Dropdown;
  @ViewChild('typeIntervenantInput') typeIntervenantInputElement!: ElementRef;
  @ViewChild('prixOperationInput') prixOperationInputElement!: ElementRef;
  @ViewChild('prixOperationMoyenInput') prixOperationMoyenInputElement!: ElementRef;






  first = 0;
  IsLoading = true;
  openModal!: boolean;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;



  @ViewChild('modal') modal!: any;

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];
  ColumnsDetailsOperationIP!: any[];

  check_actif = false;
  check_inactif = false;
  formHeader = ".....";
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any;
  codeTypeIntervenantClinique: any;
  codePriceListCash: any;
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  prixOperation: number = 0;
  prixOperationMoyen: number = 0;
  rib!: string;
  actif!: boolean;
  autorisModifInterv !: boolean;
  LabelautorisModifInterv !: string;
  visible!: boolean;
  LabelActif!: string;
  InPatient!: string;
  HeaderTypeArrvier !: string;
  LabelPrixSelonTypeArriver !: string;
  PrixOperation!: string;
  Add!: string;
  DetailsOperation  !: string;
  userCreate = sessionStorage.getItem("userName");
  dataOperation = new Array<any>();
  compteur: number = 0;
  listDesig = new Array<any>();
  selectedOperation!: any;
  ListFamilleFacturation = new Array<any>();
  selectedFamilleFacturation: any = '';
  selectedTypeIntervenantIP: any = '';
  ListFamilleOperation = new Array<any>();
  ListTypeOperation = new Array<any>();
  ListTypeIntervenant = new Array<any>();
  DetailsOperationByCodeOperationIP = new Array<DetailsOperationDTO>();
  selectedFamilleOperation: any = '';
  selectedTypeOperation: any = '';
  selectedBlocOperation: any = '';
  // outPatientBoolean: boolean = false;
  // ipPatientBoolean: boolean = false;
  // erPatientBoolean: boolean = false;
  prixSelonTypeArriverIP: number = 0;
  // prixMoyene : number = 0; 
  // disPrixOPD: boolean = false;
  // disPrixIP: boolean = false;
  // disPrixER: boolean = false;
  // TotalOPD: any = 0;
  // TotalER: any = 0;
  // TotalIP: any = 0;
  activeIndex = 0;

  /////////////////////////////////// olddd declaration 


  constructor(public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify,
    private cdRef: ChangeDetectorRef) {
  }




  ngOnInit(): void {
    this.items = [
      { label: this.i18nService.getString('LabelActif') || 'LabelActif', icon: 'pi pi-file-check', command: () => { this.GetAllOperationActif() } },
      { label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel', command: () => { this.GetAllOperationInActif() } },
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file', command: () => { this.GetAllOperation() } },
    ];
    this.activeItem = this.items[0];
    this.GetCodeTypeIntervCinic();
    this.GetCodePriceListCash();
    this.GetColumns();
    this.GetAllOperationActif();
  }

  GetCodeTypeIntervCinic() {
    this.param_service.GetParam("CodeTypeIntervCinic").
      subscribe((data: any) => {
        this.codeTypeIntervenantClinique = data.valeur;
      })
  }







  GetCodePriceListCash() {
    this.param_service.GetParam("PriceListCash").
      subscribe((data: any) => {
        this.codePriceListCash = data.valeur;
      })
  }




  GetColumns() {
    this.cols = [
      { field: 'blocOperationDTO.designationAr', header: this.i18nService.getString('BlocOperation') || 'BlocOperation', width: '20%', filter: "true" },

      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'DesignationArabic', width: '16%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '16%', filter: "false" },

      { field: 'familleFacturationDTO.designationAr', header: this.i18nService.getString('FamilleFacturation') || 'FamilleFacturation', width: '16%', filter: "false" },

      { field: 'familleOperationDTO.designationAr', header: this.i18nService.getString('FamilleOperation') || 'FamilleOperation', width: '20%', filter: "true" },
      { field: 'actif', header: this.i18nService.getString('LabelActif') || 'Actif', width: '16%', filter: "true" },

    ];
  }



  GetColumnTabDetailsOperationIP() {
    this.ColumnsDetailsOperationIP = [
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '33%', filter: "true" },
      { field: 'montant', header: this.i18nService.getString('MontantTotal') || 'Montant', width: '33%', filter: "true" },
      { field: '', header: this.i18nService.getString('Delete') || 'Delete', width: '33%', filter: "true" },
    ]
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
    this.selectedOperation = ''
    this.selectedFamilleFacturation = '';
    this.selectedFamilleOperation = '';
    this.selectedTypeOperation = '';
    this.prixSelonTypeArriverIP = 0;
    this.ListFamilleFacturation = new Array();
    this.ListFamilleOperation = new Array();
    this.ListTypeOperation = new Array();
    this.prixOperation = 0;
    this.selectedTypeIntervenantIP = '';
    this.selectedBlocOperation = ''
    this.onRowUnselect(event);

  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisieOperation").
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
    this.selectedFamilleOperation = event.data.familleOperationDTO.code;
    this.selectedTypeOperation = event.data.typeOperationDTO.code;
    this.selectedFamilleFacturation = event.data.familleFacturationDTO.code;
    this.prixOperation = event.data.coutRevient;
    this.prixOperationMoyen = event.data.prixMoyene;
    this.prixSelonTypeArriverIP = event.data.coutRevient;
    this.selectedBlocOperation = event.data.blocOperationDTO.code;
    this.autorisModifInterv = event.data.autoriseModifIntervenant;


  }
  onRowUnselect(event: any) {
    this.code = event.data = null;
  }



  DeleteOperation(code: any) {
    this.param_service.DeleteOperation(code).subscribe(
      (res: any) => {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit();
        this.visDelete = false;

      }
    )
  }


  public onOpenModal(mode: string) {

    this.DetailsOperationByCodeOperationIP = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];

    this.LabelActif = this.i18nService.getString('LabelActif');
    this.LabelautorisModifInterv = this.i18nService.getString('LabelautorisModifInterv');

    this.InPatient = this.i18nService.getString('InPatient');
    this.HeaderTypeArrvier = this.i18nService.getString('HeaderTypeArrvier');
    this.LabelPrixSelonTypeArriver = this.i18nService.getString('PrixSelonTypeArriver');
    this.DetailsOperation = this.i18nService.getString('DetailsOperation');
    this.Add = this.i18nService.getString('Add');
    this.PrixOperation = this.i18nService.getString('PrixOperation');


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
      this.setDefaultSelectedIP();
      this.clearForm();
      this.GetCodeSaisie();
      this.GetAllFamilleFacturation();
      this.GetAllTypeOperation();
      this.GetAllFamilleOperation();
      this.GetAllBlocOperation();

      this.GetColumnTabDetailsOperationIP();
      this.GetAllTypeIntervenant();
      this.DetailsOperationByCodeOperationIP = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];

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
        this.GetAllFamilleFacturation();



        this.GetAllTypeOperation();
        this.GetAllFamilleOperation();
        this.GetAllBlocOperation();


        this.GetAllTypeIntervenant();
        this.GetColumnTabDetailsOperationIP();
        this.GetDetailsOperationByCodeOperation(this.selectedOperation.code)
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
    const prixOp = this.validationService.validateInputCommun(this.prixOperationInputElement, this.prixOperation);
    const prixOpMoy = this.validationService.validateInputCommun(this.prixOperationMoyenInputElement, this.prixOperationMoyen);
    const designationAr = this.validationService.validateInputCommun(this.designationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    const famOPe = this.validationService.validateDropDownCommun(this.familleOperationInputElement, this.selectedFamilleOperation);
    const typeOperation = this.validationService.validateDropDownCommun(this.typeOperationInputElement, this.selectedTypeOperation);
    const blocOperation = this.validationService.validateDropDownCommun(this.blocOperationInputElement, this.selectedBlocOperation);

    const famFac = this.validationService.validateDropDownCommun(this.familleFacturationInputElement, this.selectedFamilleFacturation);

    return codeSaisie && designationAr && designationLt && famOPe && famFac && typeOperation && blocOperation && prixOp && prixOpMoy;
  }


  GetDataFromTableEditor: any;
  detailsOperation = new Array<any>();
  detailsPriceListsOperationPushed = new Array<any>();

  PostOperation() {
    const isValid = this.validateAllInputs();
    if (isValid) {

      if (this.prixOperation != this.prixSelonTypeArriverIP) {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showNotificationِCustom('PriceNotEquals');
      
      } else {
        const dataOperation = [
          { data: this.DetailsOperationByCodeOperationIP },
        ];
        dataOperation.forEach(dataOperationForDetailsOperation => {
          dataOperationForDetailsOperation.data.forEach((item: any) => {
            this.detailsOperation.push({
              codeTypeIntervenant: item.codeTypeIntervenant,
              montant: item.prixSelonTypeArriver,
              userCreate: this.userCreate,
              dateCreate: new Date().toISOString(),
            });
          }
          );
        });
        dataOperation.forEach(dataOperationForPriceListOperation => {
          dataOperationForPriceListOperation.data.forEach((itemDetailsPriceListOperation: any) => {
            this.detailsPriceListsOperationPushed.push({
              montant: itemDetailsPriceListOperation.prixSelonTypeArriver,
              montantPere: itemDetailsPriceListOperation.prixSelonTypeArriver,
              codeTypeIntervenant: itemDetailsPriceListOperation.codeTypeIntervenant,
              userCreate: this.userCreate,
              dateCreate: new Date().toISOString(),
              codePriceList: this.codePriceListCash,
              remMaj: "REM"
            });
          }
          );
        });
        const body = {
          code: this.selectedOperation.code,
          codeSaisie: this.codeSaisie,
          nomIntervAr: this.designationAr,
          nomIntervLt: this.designationLt,
          userCreate: this.userCreate,
          designationAr: this.designationAr,
          designationLt: this.designationLt,
          codeFamilleOperation: this.selectedFamilleOperation,
          codeTypeOperation: this.selectedTypeOperation,
          codeFamilleFacturation: this.selectedFamilleFacturation,
          codeBlocOperation: this.selectedBlocOperation,
          coutRevient: this.prixOperation,
          prixMoyene: this.prixOperationMoyen,
          detailsOperationDTOs: this.detailsOperation,
          dateCreate: new Date().toISOString(),
          actif: this.actif,
          detailsPriceListOperationDTOs: this.detailsPriceListsOperationPushed,

          autoriseModifIntervenant: this.autorisModifInterv,
        };
        const httpMethod = this.code != null ? this.param_service.UpdateOperation : this.param_service.PostOperation;
        const httpObservable = httpMethod.call(this.param_service, body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            this.detailsOperation = new Array<any>();
            this.detailsPriceListsOperationPushed = new Array<any>();
            return throwError(errorMessage);

          })
        ).subscribe(
          (res: any) => {
            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.detailsOperation = new Array<any>();
            this.detailsPriceListsOperationPushed = new Array<any>();
            this.clearForm();
            this.ngOnInit();
            this.onRowUnselect(event); // Assuming 'event' is defined somewhere
          }
        );

      }




    } else {
      this.detailsOperation = new Array<any>();
      this.detailsPriceListsOperationPushed = new Array<any>();
      console.log("Error Validation");

    }





  }










  GetAllOperation() {
    this.IsLoading = true;
    this.param_service.GetOperation().subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;

      this.IsLoading = false
      this.dataOperation = data;
      this.onRowUnselect(event);

    })
  }

  GetAllOperationActif() {
    this.IsLoading = true;
    this.param_service.GetOperationByActif(true).subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;

      this.IsLoading = false;
      this.dataOperation = data;
      this.onRowUnselect(event);

    })
  }

  GetAllOperationInActif() {
    this.IsLoading = true
    this.param_service.GetOperationByActif(false).subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;

      this.IsLoading = false
      this.dataOperation = data;
      this.onRowUnselect(event);

    })
  }





  CloseModal() {
    this.visDelete = false;
  }




  dataFamilleFacturation = new Array<any>();
  ListFamilleFacturationPushed = new Array<any>();
  GetAllFamilleFacturation() {
    this.param_service.GetFamilleFacturationActif(true).subscribe((data: any) => {
      this.dataFamilleFacturation = data;
      this.ListFamilleFacturationPushed = [];
      for (let i = 0; i < this.dataFamilleFacturation.length; i++) {
        this.ListFamilleFacturationPushed.push({ label: this.dataFamilleFacturation[i].designationAr, value: this.dataFamilleFacturation[i].code })
      }
      this.ListFamilleFacturation = this.ListFamilleFacturationPushed;
    })
  }

  dataFamilleOperation = new Array<any>();
  ListFamilleOperationPushed = new Array<any>();
  GetAllFamilleOperation() {
    this.param_service.GetFamilleOperationByActif(true).subscribe((data: any) => {
      this.dataFamilleOperation = data;
      this.ListFamilleOperationPushed = [];
      for (let i = 0; i < this.dataFamilleOperation.length; i++) {
        this.ListFamilleOperationPushed.push({ label: this.dataFamilleOperation[i].designationAr, value: this.dataFamilleOperation[i].code })
      }
      this.ListFamilleOperation = this.ListFamilleOperationPushed;
    })
  }
  ListBlocOperation = new Array<any>();
  ListBlocOperationPushed = new Array<any>();
  dataBlocOperation = new Array<any>();
  GetAllBlocOperation() {
    this.param_service.GetBlocOperationActif(true).subscribe((data: any) => {
      this.dataBlocOperation = data;
      this.ListBlocOperationPushed = [];
      for (let i = 0; i < this.dataBlocOperation.length; i++) {
        this.ListBlocOperationPushed.push({ label: this.dataBlocOperation[i].designationAr, value: this.dataBlocOperation[i].code })
      }
      this.ListBlocOperation = this.ListBlocOperationPushed;
    })
  }

  dataTypeOperation = new Array<any>();
  ListTypeOperationPushed = new Array<any>();
  GetAllTypeOperation() {
    this.param_service.GetTypeOperationActif(true).subscribe((data: any) => {
      this.dataTypeOperation = data;
      this.ListTypeOperationPushed = [];
      for (let i = 0; i < this.dataTypeOperation.length; i++) {
        this.ListTypeOperationPushed.push({ label: this.dataTypeOperation[i].designationAr, value: this.dataTypeOperation[i].code })
      }
      this.ListTypeOperation = this.ListTypeOperationPushed;
    })
  }



  dataTypeIntervenant = new Array<any>();
  ListTypeIntervenantPushed = new Array<any>();
  GetAllTypeIntervenant() {
    this.param_service.GetTypeIntervenantActif(true).subscribe((data: any) => {
      this.dataTypeIntervenant = data;
      this.ListTypeIntervenantPushed = [];
      for (let i = 0; i < this.dataTypeIntervenant.length; i++) {
        this.ListTypeIntervenantPushed.push({ label: this.dataTypeIntervenant[i].designationAr, value: this.dataTypeIntervenant[i].code })
      }
      this.ListTypeIntervenant = this.ListTypeIntervenantPushed;
      this.ListTypeIntervenant.forEach(domaine => {
        data[0].disableDropdown = true;
      });


    })
  }















  public removeIP(index: number): void {


    this.DetailsOperationByCodeOperationIP.splice(index, 1);
    this.ValueMntChangedIP();


  }

  ValueMntChangedIP() {
    let x = 0;
    for (let list of this.DetailsOperationByCodeOperationIP) {
      x += +list.prixSelonTypeArriver;
    }
    this.prixSelonTypeArriverIP = parseFloat(x.toFixed(3));
  }

  setDefaultSelectedIP() {
    if (this.DetailsOperationByCodeOperationIP && this.DetailsOperationByCodeOperationIP.length > 0) {
      this.DetailsOperationByCodeOperationIP[0].codeTypeIntervenant = 1;
      this.prixSelonTypeArriverIP = 0;

      this.param_service.GetTypeIntervenantByCode(this.codeTypeIntervenantClinique).subscribe((data: any) => {
        this.DetailsOperationByCodeOperationIP[0].designationArTypeIntervenant = data.designationAr

        this.DetailsOperationByCodeOperationIP[0].codeTypeIntervenant = data.code

      }
      );
    }
  }




  clickDropDownUpOPD(dropDownModUp: any) {
    if ((dropDownModUp.documentClickListener !== undefined && dropDownModUp.selectedOption !== null && dropDownModUp.itemClick) || dropDownModUp.itemClick) {
      dropDownModUp.focus();
      if (!dropDownModUp.overlayVisible) {
        dropDownModUp.show();
        event!.preventDefault();
      } else {
        dropDownModUp.hide();
        event!.preventDefault();
      }
    }
  }
  NewcompteurOPD: number = 0;
  NoAction() {

  }


  clickDropDownUpIP(dropDownModUp: any) {
    if ((dropDownModUp.documentClickListener !== undefined && dropDownModUp.selectedOption !== null && dropDownModUp.itemClick) || dropDownModUp.itemClick) {
      dropDownModUp.focus();
      if (!dropDownModUp.overlayVisible) {
        dropDownModUp.show();
        event!.preventDefault();
      } else {
        dropDownModUp.hide();
        event!.preventDefault();
      }
    }
  }
  NewcompteurIP: number = 0;

  PushTableDataIP() {
    var exist = false;

    for (var y = 0; y < this.DetailsOperationByCodeOperationIP.length; y++) {
      if (this.selectedTypeIntervenantIP != this.DetailsOperationByCodeOperationIP[y].codeTypeIntervenant) {
        exist = false;
      } else {
        exist = true;

        this.CtrlAlertify.showNotificationِCustom('TypeIntervenantDupliquer');
        this.CtrlAlertify.PostionLabelNotification();
        break;
      }
    }

    if ((this.selectedTypeIntervenantIP != undefined) && (this.selectedTypeIntervenantIP != "") && (!exist)) {
      this.param_service.GetTypeIntervenantByCode(this.selectedTypeIntervenantIP).subscribe((Newdata: any) => {
        this.NewcompteurIP = this.NewcompteurIP + 1;

        this.DetailsOperationByCodeOperationIP.push(Newdata);
        this.DetailsOperationByCodeOperationIP[y].prixSelonTypeArriver = 0;


      })
    }

  }


  GetDetailsOperationByCodeOperation(codeOperation: number) {
    this.param_service.GetDetailsOperationByCode(codeOperation).subscribe((data: any) => {
      this.DetailsOperationByCodeOperationIP = data;
    });
  }



}


