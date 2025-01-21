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



interface DetailsPrestationDTO {
  // code:number;
  codeTypeIntervenant: number | null;
  designationArTypeIntervenant: string;
  prixSelonTypeArriver: number;
  userCreate: string;
  dateCreate: string;
}
@Component({
  selector: 'app-prestation',
  templateUrl: './prestation.component.html',
  styleUrls: ['./prestation.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class PrestationComponent implements OnInit {
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeErrorDrop') codeErrorElementDrop!: Dropdown;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') designationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('famillePrestationInput') famillePrestationInputElement!: Dropdown;
  @ViewChild('sousFamillePrestationInput') sousFamillePrestationInputElement!: Dropdown;
  @ViewChild('familleFacturationInput') familleFacturationInputElement!: Dropdown;
  @ViewChild('prixSelonTypeArriverIPInput') prixSelonTypeArriverIPInputElement!: ElementRef;
  @ViewChild('prixSelonTypeArriverOPDInput') prixSelonTypeArriverOPDInputElement!: ElementRef;
  @ViewChild('prixSelonTypeArriverERInput') prixSelonTypeArriverERInputElement!: ElementRef;
  @ViewChild('typeIntervenantInput') typeIntervenantInputElement!: ElementRef;




  first = 0;
  IsLoading = true;
  openModal!: boolean;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;



  @ViewChild('modal') modal!: any;
 
  pdfData!: Blob;
  isLoading = false;
  cols!: any[];
  ColumnsDetailsPrestationOPD!: any[];
  ColumnsDetailsPrestationER!: any[];
  ColumnsDetailsPrestationIP!: any[];

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
  codeNatureAdmissionER: any;
  codeNatureAdmissionIP: any;
  codeNatureAdmissionOPD: any;
  codePriceListCash: any;
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  prixPrestation: number = 0;
  rib!: string;
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string;
  OutPatient!: string;
  InPatient!: string;
  ErPatient!: string;
  HeaderTypeArrvier !: string;
  LabelPrixSelonTypeArriver !: string;
  PrixPrestation!: string;
  Add!: string;
  DetailsPrestation  !: string;
  userCreate = sessionStorage.getItem("userName");
  dataPrestation = new Array<any>();
  compteur: number = 0;
  listDesig = new Array<any>();
  selectedPrestation!: any;
  ListFamilleFacturation = new Array<any>();
  selectedFamilleFacturation: any = '';
  selectedTypeIntervenantOPD: any = '';
  selectedTypeIntervenantIP: any = '';
  selectedTypeIntervenantER: any = '';
  ListFamillePrestation = new Array<any>();
  ListSousFamillePrestation = new Array<any>();
  ListTypeIntervenant = new Array<any>();
  DetailsPrestationByCodePrestationOPD = new Array<DetailsPrestationDTO>();
  DetailsPrestationByCodePrestationER = new Array<DetailsPrestationDTO>();
  DetailsPrestationByCodePrestationIP = new Array<DetailsPrestationDTO>();
  selectedFamillePrestation: any = '';
  selectedSousFamillePrestation: any = '';
  outPatientBoolean: boolean = false;
  ipPatientBoolean: boolean = false;
  erPatientBoolean: boolean = false;
  prixSelonTypeArriverIP: number = 0;
  prixSelonTypeArriverOPD:  number = 0;
  prixSelonTypeArriverER: number = 0;
  disPrixOPD: boolean = false;
  disPrixIP: boolean = false;
  disPrixER: boolean = false;
  TotalOPD: any = 0;
  TotalER: any = 0;
  TotalIP: any = 0;
  activeIndex = 0;

  /////////////////////////////////// olddd declaration 


  constructor(public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify,
    private cdRef: ChangeDetectorRef) {
  }




  ngOnInit(): void {
    this.items = [
      { label:  this.i18nService.getString('LabelActif') || 'LabelActif' , icon: 'pi pi-file-check' , command: () => { this.GetAllPrestationActif() } },
      { label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel' , command: () => { this.GetAllPrestationInActif() }},
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file' , command: () => { this.GetAllPrestation() } }, 
  ];
  this.activeItem = this.items[0]; 
    this.GetCodeTypeIntervCinic();
    this.GetCodeNatureAdmissionIP();
    this.GetCodeNatureAdmissionOPD();
    this.GetCodeNatureAdmissionER();
    this.GetCodePriceListCash();
    this.GetColumns(); 
    this.GetAllPrestationActif(); 
  }
  
  GetCodeTypeIntervCinic() {
    this.param_service.GetParam("CodeTypeIntervCinic").
      subscribe((data: any) => {
        this.codeTypeIntervenantClinique = data.valeur;
      })
  }


  GetCodeNatureAdmissionER() {
    this.param_service.GetParam("CodeNatureAdmissionER").
      subscribe((data: any) => {
        this.codeNatureAdmissionER = data.valeur;
      })
  }



  GetCodeNatureAdmissionOPD() {
    this.param_service.GetParam("CodeNatureAdmissionOPD").
      subscribe((data: any) => {
        this.codeNatureAdmissionOPD = data.valeur;
      })
  }

  GetCodeNatureAdmissionIP() {
    this.param_service.GetParam("CodeNatureAdmissionIP").
      subscribe((data: any) => {
        this.codeNatureAdmissionIP = data.valeur;
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
      { field: 'famillePrestationDTO.designationAr', header: this.i18nService.getString('FamillePrestation') || 'FamillePrestation', width: '20%', filter: "true" },
      { field: 'sousFamillePrestationDTO.designationAr', header: this.i18nService.getString('SousFamillePrestation') || 'SousFamillePrestation', width: '20%', filter: "true" },

      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '16%', filter: "true" },
      { field: 'designationLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLatin', width: '16%', filter: "false" },
      { field: 'familleFacturationDTO.designationAr', header: this.i18nService.getString('FamilleFacturation') || 'FamilleFacturation', width: '16%', filter: "false" },
      { field: 'actif', header: this.i18nService.getString('LabelActif') || 'Actif', width: '16%', filter: "true" },

    ];
  }

  GetColumnTabDetailsPrestationOPD() {
    this.ColumnsDetailsPrestationOPD = [
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '33%', filter: "true" },
      { field: 'montant', header: this.i18nService.getString('MontantTotal') || 'Montant', width: '33%', filter: "true" },
      { field: '', header: this.i18nService.getString('Delete') || 'Delete', width: '33%', filter: "true" },
    ]
  }
  GetColumnTabDetailsPrestationER() {
    this.ColumnsDetailsPrestationER = [
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '33%', filter: "true" },
      { field: 'montant', header: this.i18nService.getString('MontantTotal') || 'Montant', width: '33%', filter: "true" },
      { field: '', header: this.i18nService.getString('Delete') || 'Delete', width: '33%', filter: "true" },
    ]
  }

  GetColumnTabDetailsPrestationIP() {
    this.ColumnsDetailsPrestationIP = [
      { field: 'designationAr', header: this.i18nService.getString('DesignationAr') || 'DesignationArabic', width: '33%', filter: "true" },
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
    this.selectedPrestation = ''
    this.selectedFamilleFacturation = '';
    this.selectedFamillePrestation = '';
    this.selectedSousFamillePrestation = '';
    this.prixSelonTypeArriverER = 0;
    this.prixSelonTypeArriverIP =  0;
    this.prixSelonTypeArriverOPD =  0;
    this.ListFamilleFacturation = new Array();
    this.ListFamillePrestation = new Array();
    this.ListSousFamillePrestation = new Array();
    this.erPatientBoolean = false;
    this.outPatientBoolean = false;
    this.ipPatientBoolean = false; 
    this.prixPrestation = 0;
    this.onRowUnselect(event);

  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisiePRES").
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
    this.selectedFamillePrestation = event.data.famillePrestationDTO.code;
    this.selectedSousFamillePrestation = event.data.sousFamillePrestationDTO.code;
    this.selectedFamilleFacturation = event.data.familleFacturationDTO.code;
    this.erPatientBoolean = event.data.er;
    this.outPatientBoolean = event.data.opd;
    this.ipPatientBoolean = event.data.ip;
    this.prixPrestation = event.data.prixPrestation;
    this.prixSelonTypeArriverER = event.data.montantER;
    this.prixSelonTypeArriverOPD = event.data.montantOPD;
    this.prixSelonTypeArriverIP = event.data.montantIP;


  }
  onRowUnselect(event: any) {
    this.code = event.data = null;
  }



  DeletePrestation(code: any) {
    this.param_service.DeletePrestation(code).subscribe(
      (res: any) => {
        this.CtrlAlertify.showLabel();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit();
        this.visDelete = false;

      }
    )
  }


  public onOpenModal(mode: string) {
    // this.prixSelonTypeArriverER="";
    // this.prixSelonTypeArriverIP="";
    // this.prixSelonTypeArriverOPD="";

    // this.DetailsPrestationByCodePrestationER = new Array();
    // this.DetailsPrestationByCodePrestationOPD = new Array();
    // this.DetailsPrestationByCodePrestationIP = new Array();

    this.DetailsPrestationByCodePrestationOPD = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];
    this.DetailsPrestationByCodePrestationER = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];
    this.DetailsPrestationByCodePrestationIP = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];

    this.LabelActif = this.i18nService.getString('LabelActif');
    this.OutPatient = this.i18nService.getString('OutPatient');
    this.ErPatient = this.i18nService.getString('ErPatient');
    this.InPatient = this.i18nService.getString('InPatient');
    this.HeaderTypeArrvier = this.i18nService.getString('HeaderTypeArrvier');
    this.LabelPrixSelonTypeArriver = this.i18nService.getString('PrixSelonTypeArriver');
    this.DetailsPrestation = this.i18nService.getString('DetailsPrestation');
    this.Add = this.i18nService.getString('Add');
    this.PrixPrestation = this.i18nService.getString('PrixPrestation');


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
      this.GetAllFamilleFacturation();
      this.GetAllFamillePrestation(); 

      this.GetColumnTabDetailsPrestationOPD();
      this.GetColumnTabDetailsPrestationER();
      this.GetColumnTabDetailsPrestationIP();
      this.GetAllTypeIntervenant();
      this.DetailsPrestationByCodePrestationOPD = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];
      this.DetailsPrestationByCodePrestationER = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];
      this.DetailsPrestationByCodePrestationIP = [{ codeTypeIntervenant: null, designationArTypeIntervenant: "", prixSelonTypeArriver: 0, userCreate: "", dateCreate: "" }];

      this.actif = false;
      this.visible = false;
      this.visibleModal = true;
      this.code == undefined;
      if (this.erPatientBoolean == true) {
        this.disPrixER = true
      } else {
        this.disPrixER = false

      }

      if (this.outPatientBoolean == true) {
        this.disPrixOPD = true
      } else {
        this.disPrixOPD = false

      }


      if (this.ipPatientBoolean == true) {
        this.disPrixIP = true
      } else {
        this.disPrixIP = false

      }

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
        this.GetAllFamilleFacturation();
        this.GetAllFamillePrestation();
        this.GetAllSousFamillePrestationForModif();
        this.GetAllTypeIntervenant();
        this.GetColumnTabDetailsPrestationOPD();
        this.GetColumnTabDetailsPrestationER();
        this.GetColumnTabDetailsPrestationIP();
        this.visibleModal = true;
        this.onRowSelect;

        if (this.erPatientBoolean == true) {
          this.disPrixER = true
          this.param_service.GetDetailsPrestationByCodeAndCodeNatureAdmission(this.selectedPrestation.code, this.codeNatureAdmissionER).subscribe((data: any) => {
            this.DetailsPrestationByCodePrestationER = data;
          })

        } else {
          this.disPrixER = false
        }
        if (this.outPatientBoolean == true) {
          this.disPrixOPD = true
          this.param_service.GetDetailsPrestationByCodeAndCodeNatureAdmission(this.selectedPrestation.code, this.codeNatureAdmissionOPD).subscribe((data: any) => {
            this.DetailsPrestationByCodePrestationOPD = data;
          })
        } else {
          this.disPrixOPD = false
        }
        if (this.ipPatientBoolean == true) {
          this.disPrixIP = true
          this.param_service.GetDetailsPrestationByCodeAndCodeNatureAdmission(this.selectedPrestation.code, this.codeNatureAdmissionIP).subscribe((data: any) => {
            this.DetailsPrestationByCodePrestationIP = data;
          })
        } else {
          this.disPrixIP = false
        }

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
        this.formHeader = "Imprimer Liste SpecialiteMedecin"
        this.visibleModalPrint = true;
        // this.RemplirePrint();

      }




    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.designationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    const famPres = this.validationService.validateDropDownCommun(this.famillePrestationInputElement, this.selectedFamillePrestation);
    const SousfamPres = this.validationService.validateDropDownCommun(this.sousFamillePrestationInputElement, this.selectedSousFamillePrestation);

    const famFac = this.validationService.validateDropDownCommun(this.familleFacturationInputElement, this.selectedFamilleFacturation);

    return codeSaisie && designationAr && designationLt && famPres && famFac;
  }


  GetDataFromTableEditor: any;
  final = new Array<any>();
  detailsPriceListsPushed = new Array<any>();

  PostPrestation() {
    const isValid = this.validateAllInputs();
    if (isValid) {

      // Combine data collection into a single loop for each patient type
      const patientTypes = [
        { type: 'OPD', boolean: this.outPatientBoolean, codeNatureAdmission: 2, data: this.DetailsPrestationByCodePrestationOPD },
        { type: 'IP', boolean: this.ipPatientBoolean, codeNatureAdmission: 1, data: this.DetailsPrestationByCodePrestationIP },
        { type: 'ER', boolean: this.erPatientBoolean, codeNatureAdmission: 3, data: this.DetailsPrestationByCodePrestationER },
      ];

      patientTypes.forEach(patientType => {
        if (patientType.boolean) {
          patientType.data.forEach(item => {
            this.final.push({
              codeNatureAdmission: patientType.codeNatureAdmission,
              codeTypeIntervenant: item.codeTypeIntervenant,
              montant: item.prixSelonTypeArriver,
              userCreate: this.userCreate,
              dateCreate: new Date().toISOString(),
            });
          } 
       
        );
        }
      });


      patientTypes.forEach(patientType => {
        if (patientType.boolean) {
          patientType.data.forEach(itemDetailsPriceList => {
            this.detailsPriceListsPushed.push({
              codeNatureAdmission: patientType.codeNatureAdmission, 
              montant: itemDetailsPriceList.prixSelonTypeArriver,
              montantPere:  itemDetailsPriceList.prixSelonTypeArriver,
              codeTypeIntervenant: itemDetailsPriceList.codeTypeIntervenant,
              userCreate: this.userCreate,
              dateCreate: new Date().toISOString(),
              codePriceList:this.codePriceListCash,
              remMaj:"REM"
            });
          } 
       
        );
        }
      });



     



      const body = {
        code: this.selectedPrestation.code,
        codeSaisie: this.codeSaisie,
        nomIntervAr: this.designationAr,
        nomIntervLt: this.designationLt,
        userCreate: this.userCreate,
        designationAr: this.designationAr,
        designationLt: this.designationLt,
        codeFamillePrestation: this.selectedFamillePrestation,
        codeSousFamillePrestation: this.selectedSousFamillePrestation,
        codeFamilleFacturation: this.selectedFamilleFacturation,
        opd: this.outPatientBoolean,
        er: this.erPatientBoolean,
        ip: this.ipPatientBoolean,
        montantOPD: this.prixSelonTypeArriverOPD,
        montantER: this.prixSelonTypeArriverER,
        montantIP: this.prixSelonTypeArriverIP,
        prixPrestation: this.prixPrestation,
        detailsPrestationDTOs: this.final,
        dateCreate: new Date().toISOString(),
        actif: this.actif,
        detailsPriceLists: this.detailsPriceListsPushed
      };

      const httpMethod = this.code != null ? this.param_service.UpdatePrestation : this.param_service.PostPrestation;
      const httpObservable = httpMethod.call(this.param_service, body).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          this.final = new Array<any>();
          this.detailsPriceListsPushed = new Array<any>();
          return throwError(errorMessage);

        })
      ).subscribe(
        (res: any) => {
          this.CtrlAlertify.showLabel();
          this.CtrlAlertify.ShowSavedOK();
          this.visibleModal = false;
          this.final = new Array<any>();
          this.detailsPriceListsPushed = new Array<any>();
          this.clearForm();
          this.ngOnInit();
          this.onRowUnselect(event); // Assuming 'event' is defined somewhere
        }
      );


    } else {
      this.final = new Array<any>();
      this.detailsPriceListsPushed = new Array<any>();
      console.log("Error Validation");

    }





  }










  GetAllPrestation() {
    this.param_service.GetPrestation().subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;

      this.IsLoading = false
      this.dataPrestation = data; 
      this.onRowUnselect(event);

    })
  }

  GetAllPrestationActif() {
    this.param_service.GetPrestationByActif(true).subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;

      this.IsLoading = false
      this.dataPrestation = data; 
      this.onRowUnselect(event);

    })
  }
   
  GetAllPrestationInActif() {
    this.param_service.GetPrestationByActif(false).subscribe((data: any) => {

      this.loadingComponent.IsLoading = false;

      this.IsLoading = false
      this.dataPrestation = data; 
      this.onRowUnselect(event);

    })
  }
   

  


  CloseModal() {
    this.visDelete = false;
  }




  dataFamilleFacturation = new Array<any>();
  ListFamilleFacturationPushed = new Array<any>();
  GetAllFamilleFacturation() {
    this.param_service.GetFamilleFacturation().subscribe((data: any) => {
      this.dataFamilleFacturation = data;
      this.ListFamilleFacturationPushed = [];
      for (let i = 0; i < this.dataFamilleFacturation.length; i++) {
        this.ListFamilleFacturationPushed.push({ label: this.dataFamilleFacturation[i].designationAr, value: this.dataFamilleFacturation[i].code })
      }
      this.ListFamilleFacturation = this.ListFamilleFacturationPushed;
    })
  }



  dataFamillePrestation = new Array<any>();
  ListFamillePrestationPushed = new Array<any>();
  GetAllFamillePrestation() {
    this.param_service.GetFamillePrestation().subscribe((data: any) => {
      this.dataFamillePrestation = data;
      this.ListFamillePrestationPushed = [];
      for (let i = 0; i < this.dataFamillePrestation.length; i++) {
        this.ListFamillePrestationPushed.push({ label: this.dataFamillePrestation[i].designationAr, value: this.dataFamillePrestation[i].code })
      }
      this.ListFamillePrestation = this.ListFamillePrestationPushed;
    })
  }

  
  dataSousFamillePrestation = new Array<any>();
  ListSousFamillePrestationPushed = new Array<any>();
  GetAllSousFamillePrestation(codefamilleprestation: number) {  
    this.param_service.GetSousFamillePrestationByCodeFamille(codefamilleprestation).subscribe((data: any) => {
      this.dataSousFamillePrestation = data;
      this.ListSousFamillePrestationPushed = [];
      for (let i = 0; i < this.dataSousFamillePrestation.length; i++) {
        this.ListSousFamillePrestationPushed.push({ label: this.dataSousFamillePrestation[i].designationAr, value: this.dataSousFamillePrestation[i].code })
      }
      this.ListSousFamillePrestation = this.ListSousFamillePrestationPushed;
    })
  }


  GetAllSousFamillePrestationForModif() {  
    this.param_service.GetSousFamillePrestation().subscribe((data: any) => {
      this.dataSousFamillePrestation = data;
      this.ListSousFamillePrestationPushed = [];
      for (let i = 0; i < this.dataSousFamillePrestation.length; i++) {
        this.ListSousFamillePrestationPushed.push({ label: this.dataSousFamillePrestation[i].designationAr, value: this.dataSousFamillePrestation[i].code })
      }
      this.ListSousFamillePrestation = this.ListSousFamillePrestationPushed;
    })
  }



  dataTypeIntervenant = new Array<any>();
  ListTypeIntervenantPushed = new Array<any>();
  GetAllTypeIntervenant() {
    this.param_service.GetTypeIntervenant().subscribe((data: any) => {
      this.dataTypeIntervenant = data;
      this.ListTypeIntervenantPushed = [];
      for (let i = 0; i < this.dataTypeIntervenant.length; i++) {
        this.ListTypeIntervenantPushed.push({ label: this.dataTypeIntervenant[i].designationAr, value: this.dataTypeIntervenant[i].code })
      }
      this.ListTypeIntervenant = this.ListTypeIntervenantPushed;
      this.ListTypeIntervenant.forEach(domaine => {
        // domaine.selectedTypeIntervenantOPD = null; // or a default value if needed
        data[0].disableDropdown = true;
        // domaine.selectedTypeIntervenantER = null; // or a default value if needed
        // domaine.selectedTypeIntervenantIP = null; // or a default value if needed
      });


    })
  }


  GetDetailsPrestationByCodePrestation(codePrestation: number) {
    this.param_service.GetDetailsPrestationByCode(codePrestation).subscribe((data: any) => {
      this.DetailsPrestationByCodePrestationOPD = data;
    });
  }



  updatePrices(event: any, type: string) {
    switch (type) {
      case 'opd':
        this.disPrixOPD = event.checked;
        // this.DetailsPrestationByCodePrestationOPD = new Array();
        // this.prixSelonTypeArriverOPD = event.checked ? this.prixPrestation : "";
        this.setDefaultSelectedOPD();

        break;
      case 'er':
        this.disPrixER = event.checked;
        // this.DetailsPrestationByCodePrestationER = new Array();
        // this.prixSelonTypeArriverER = event.checked ? this.prixPrestation : "";
        this.setDefaultSelectedER();

        break;
      case 'ip':
        this.disPrixIP = event.checked;
        // this.DetailsPrestationByCodePrestationIP = new Array();
        // this.prixSelonTypeArriverIP = event.checked ? this.prixPrestation : "";
        this.setDefaultSelectedIP();
        break;
    }
    this.cdRef.detectChanges();
  }




  public removeOPD(index: number): void {
    this.DetailsPrestationByCodePrestationOPD.splice(index, 1);
    this.ValueMntChangedOPD();

  }

  ValueMntChangedOPD() {
    let x = 0; 
    for (let list of this.DetailsPrestationByCodePrestationOPD) {
      x += +list.prixSelonTypeArriver;
    }
    this.prixSelonTypeArriverOPD = parseFloat(x.toFixed(3));
  }


  public removeER(index: number): void {
    this.DetailsPrestationByCodePrestationER.splice(index, 1);
    this.ValueMntChangedER();

  }

  ValueMntChangedER() {
    let x = 0; 
    for (let list of this.DetailsPrestationByCodePrestationER) {
      x += +list.prixSelonTypeArriver;
    }
    this.prixSelonTypeArriverER = parseFloat(x.toFixed(3));
  }
  public removeIP(index: number): void {

    if (index !== 0) {  // Only remove if not the first row
      this.DetailsPrestationByCodePrestationIP.splice(index, 1);
      this.ValueMntChangedER();
    }


  }

  ValueMntChangedIP() {
    let x = 0;
    for (let list of this.DetailsPrestationByCodePrestationIP) {
      x += +list.prixSelonTypeArriver;
    }
    this.prixSelonTypeArriverIP = parseFloat(x.toFixed(3));
  }

  setDefaultSelectedIP() {
    if (this.DetailsPrestationByCodePrestationIP && this.DetailsPrestationByCodePrestationIP.length > 0) {
      this.DetailsPrestationByCodePrestationIP[0].codeTypeIntervenant = 1;
      this.prixSelonTypeArriverIP = 0;

      this.param_service.GetTypeIntervenantByCode(this.codeTypeIntervenantClinique).subscribe((data: any) => {
        this.DetailsPrestationByCodePrestationIP[0].designationArTypeIntervenant = data.designationAr

        this.DetailsPrestationByCodePrestationIP[0].codeTypeIntervenant = data.code

      }
      );
    }
  }
  setDefaultSelectedOPD() {
    if (this.DetailsPrestationByCodePrestationOPD && this.DetailsPrestationByCodePrestationOPD.length > 0) {
      this.DetailsPrestationByCodePrestationOPD[0].codeTypeIntervenant = 1;
      this.prixSelonTypeArriverOPD = 0;
      this.param_service.GetTypeIntervenantByCode(this.codeTypeIntervenantClinique).subscribe((data: any) => {
        this.DetailsPrestationByCodePrestationOPD[0].designationArTypeIntervenant = data.designationAr


        this.DetailsPrestationByCodePrestationOPD[0].codeTypeIntervenant = data.code
      }
      );

    }
  }
  setDefaultSelectedER() {
    if (this.DetailsPrestationByCodePrestationER && this.DetailsPrestationByCodePrestationER.length > 0) {
      this.DetailsPrestationByCodePrestationER[0].codeTypeIntervenant = 1;
      this.prixSelonTypeArriverER = 0;

      this.param_service.GetTypeIntervenantByCode(this.codeTypeIntervenantClinique).subscribe((data: any) => {
        this.DetailsPrestationByCodePrestationER[0].designationArTypeIntervenant = data.designationAr
        this.DetailsPrestationByCodePrestationER[0].codeTypeIntervenant = data.code
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

  PushTableDataOPD() {
    var exist = false;

    for (var y = 0; y < this.DetailsPrestationByCodePrestationOPD.length; y++) {
      if (this.selectedTypeIntervenantOPD != this.DetailsPrestationByCodePrestationOPD[y].codeTypeIntervenant) {
        exist = false;
      } else {
        exist = true;

        this.CtrlAlertify.showNotificationِCustom('TypeIntervenantDupliquer');
        this.CtrlAlertify.showLabel();
        break;
      }
    }

    if ((this.selectedTypeIntervenantOPD != undefined) && (this.selectedTypeIntervenantOPD != "") && (!exist)) {
      this.param_service.GetTypeIntervenantByCode(this.selectedTypeIntervenantOPD).subscribe((Newdata: any) => {
        this.NewcompteurOPD = this.NewcompteurOPD + 1;

        this.DetailsPrestationByCodePrestationOPD.push(Newdata);
        this.DetailsPrestationByCodePrestationOPD[y].prixSelonTypeArriver = 0;


      })
    }

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

    for (var y = 0; y < this.DetailsPrestationByCodePrestationIP.length; y++) {
      if (this.selectedTypeIntervenantIP != this.DetailsPrestationByCodePrestationIP[y].codeTypeIntervenant) {
        exist = false;
      } else {
        exist = true;

        this.CtrlAlertify.showNotificationِCustom('TypeIntervenantDupliquer');
        this.CtrlAlertify.showLabel();
        break;
      }
    }

    if ((this.selectedTypeIntervenantIP != undefined) && (this.selectedTypeIntervenantIP != "") && (!exist)) {
      this.param_service.GetTypeIntervenantByCode(this.selectedTypeIntervenantIP).subscribe((Newdata: any) => {
        this.NewcompteurIP = this.NewcompteurIP + 1;

        this.DetailsPrestationByCodePrestationIP.push(Newdata);
        this.DetailsPrestationByCodePrestationIP[y].prixSelonTypeArriver = 0;


      })
    }

  }

  clickDropDownUpER(dropDownModUp: any) {
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
  NewcompteurER: number = 0;

  PushTableDataER() {
    var exist = false;

    for (var y = 0; y < this.DetailsPrestationByCodePrestationER.length; y++) {
      if (this.selectedTypeIntervenantER != this.DetailsPrestationByCodePrestationER[y].codeTypeIntervenant) {
        exist = false;
      } else {
        exist = true;

        this.CtrlAlertify.showNotificationِCustom('TypeIntervenantDupliquer');
        this.CtrlAlertify.showLabel();
        break;
      }
    }

    if ((this.selectedTypeIntervenantER != undefined) && (this.selectedTypeIntervenantER != "") && (!exist)) {
      this.param_service.GetTypeIntervenantByCode(this.selectedTypeIntervenantER).subscribe((Newdata: any) => {
        this.NewcompteurER = this.NewcompteurER + 1;

        this.DetailsPrestationByCodePrestationER.push(Newdata);
        this.DetailsPrestationByCodePrestationER[y].prixSelonTypeArriver = 0;


      })
    }

  }



}


