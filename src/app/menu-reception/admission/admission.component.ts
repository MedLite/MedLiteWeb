import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { Dropdown } from 'primeng/dropdown';
import { ReceptionService } from '../ServiceClient/reception.service';
import { ParametargeService } from '../../menu-parametrage/ServiceClient/parametarge.service';



import { throwError, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; //You still need map from rxjs/operators
import { HttpErrorResponse } from '@angular/common/http';
import { EncryptionService } from '../../Shared/EcrypteService/EncryptionService';
interface Column {
  field: string;
  header: string;
}
interface YourDataType {
  // Define the structure of your data (matches the SQL table columns)
  id: number;
  name: string;
  // ... other properties
}
declare const PDFObject: any;
@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.css', '.../../../src/assets/css/StyleGroupBtnAndTable.css',
    '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [ConfirmationService, MessageService, InputValidationService, CalanderTransService, ControlServiceAlertify]
})
export class AdmissionComponent implements OnInit {



  first = 0;
  @ViewChild('codeInput') codeInputElement!: ElementRef;
  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeErrorDrop') codeErrorElementDrop!: Dropdown;
  @ViewChild('nomArInput') nomArInputElement!: ElementRef;
  @ViewChild('nomError') nomErrorElement!: ElementRef;
  @ViewChild('nomLtInput') nomLtInputElement!: ElementRef;
  @ViewChild('TelPatientInput') TelPatientInputElement!: ElementRef;
  @ViewChild('SpecialiteMedecinInput') SpecialiteMedecinInputElement!: ElementRef;

  @ViewChild('modeReglementInput') modeReglementInputElement!: Dropdown;
  @ViewChild('BanqueInput') BanqueInputElement!: Dropdown;
  @ViewChild('NumPieceInput') NumPieceInputElement!: ElementRef;
  @ViewChild('codePatientInput') codePatientInputElement!: ElementRef;



  @ViewChild('codePatientNewInput') codePatientNewInputElement!: ElementRef;
  @ViewChild('nomFullArNewInput') nomFullArNewInputElement!: ElementRef;
  @ViewChild('nomFullLtNewInput') nomFullLtNewInputElement!: ElementRef;
  @ViewChild('telPatientNewInput') telPatientNewInputElement!: ElementRef;

  @ViewChild('iDPatientInput') iDPatientInputElement!: ElementRef;
  @ViewChild('mntPayedInput') mntPayedInputElement!: ElementRef;



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codePatientNewInputElement, this.codePatientNew);
    const nomAr = this.validationService.validateInputCommun(this.nomFullArNewInputElement, this.nomFullArNew);
    const nomLt = this.validationService.validateInputCommun(this.nomFullLtNewInputElement, this.nomFullLtNew);
    const tel = this.validationService.validateInputCommun(this.telPatientNewInputElement, this.TelPatientNew);


    return codeSaisie && nomAr && nomLt && tel;
  }



  data: YourDataType[] = [];
  validateCodeInput() {
    this.validationService.validateInput(this.codeInputElement, this.codeErrorElement, this.codeSaisie, 'codeSaisie');
  }

  validateModeReglementInput() {
    if (this.modeReglementInputElement && this.modeReglementInputElement.containerViewChild) { // Check if containerViewChild exists
      if (this.selectedModeReglement == undefined || this.selectedModeReglement == null || this.selectedModeReglement == '') {
        this.modeReglementInputElement.overlayVisible = true;
        this.cdr.detectChanges();
        this.modeReglementInputElement.containerViewChild.nativeElement.classList.add('InvalidData');
      } else {
        this.modeReglementInputElement.containerViewChild.nativeElement.classList.remove('InvalidData');
      }
    } else {
      console.warn("Dropdown not yet initialized for validation.");
    }
  }

  validateBanqueInput() {
    if (this.selectedModeReglement == "2" && this.selectedBanque == "") {
      this.validationService.validateDropDownInput(this.BanqueInputElement, this.codeErrorElementDrop, this.selectedBanque, 'Banque');
    } else {
      if (this.BanqueInputElement && this.BanqueInputElement.containerViewChild) {
        this.BanqueInputElement.containerViewChild.nativeElement.classList.remove('InvalidData');
      }
    }
  }


  validateNumPieceInput() {
    if (this.selectedModeReglement == "2" && this.numPiece == "") {
      this.validationService.validateInput(this.NumPieceInputElement, this.nomErrorElement, this.numPiece, 'NumPiece');

    } else {
      this.NumPieceInputElement.nativeElement.classList.remove('invalid-input');
    }
  }

  validateNomArInput() {
    this.validationService.validateInput(this.nomArInputElement, this.nomErrorElement, this.NomPatientFullAr, 'NomPatientFullAr');
  }


  validateCodePatientInput() {
    this.validationService.validateInput(this.codePatientInputElement, this.nomErrorElement, this.codePatient, 'CodePatient');
  }

  validateNomLtInput() {
    this.validationService.validateInput(this.nomLtInputElement, this.nomErrorElement, this.NomPatientFullLt, 'NomPatientFullLt');
  }
  validateTelPatientInput() {
    this.validationService.validateInput(this.TelPatientInputElement, this.nomErrorElement, this.TelPatientAdm, 'Tel');
  }



  validateSpecialiteMedecinInput() {
    this.validationService.validateInput(this.SpecialiteMedecinInputElement, this.nomErrorElement, this.SpecialiteMedecin, 'Spec');
  }




  IsLoading = true;
  openModal!: boolean;
  VisVoir: boolean = true;
  VisBtnApprouveAvance: boolean = false;
  VisBtnApprouve: boolean = false;
  VisModif: boolean = true;
  visBtnSave: boolean = true;
  VisBtnDelete: boolean = true;
  DisModif: boolean = true;
  DateTypeCaisse = new Array<any>();
  SelectedTypeCaisse!: any;
  listDetailsTypeDepense = new Array<any>();
  SelectedPatientFromList: any;
  SelectedMedecinFromList: any;
  listselectedTypeDepenseRslt = new Array<any>();
  selectedTypeDepense: any;
  observation: any = null;
  selectedCostCentre: any;
  listCostCentreRslt = new Array<any>();
  MontantEnDevise: any = 0
  visibleModal: boolean = false;
  visibleModalAddPatient: boolean = false;
  visibleModalRecherPatient: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any = null;
  NomPatientFullLt: any = null;
  NomPatientFullLtRecherche: any = null;
  NomPatientFullAr: any = null;
  NomPatientFullArRecherche: any = null;
  TelPatient: any = null;
  TelPatientRecherche: any = null;
  codeConvention: any = null;
  codeSociete: any = null;
  codePriceList: number = 0;
  codecostCenter: any;
  NumFactFrs: any;
  MntFactFrs: any;
  montant: string = '0';
  TauxChange: number = 0;
  listDeviseRslt = new Array<any>();
  dateFactureFournisseur: any;
  DateTemp: any;
  selectedDevise: any;
  selectedFournisseur: any;
  selectedTotal = new Array<any>;
  Total: number = 0;
  DisBanque: boolean = true;
  DisCaisse: boolean = true;
  ListPatientTried = new Array<any>();
  ListMedecinTried = new Array<any>();
  MontantEnDeviseFacture: any;
  numPiece: any = null;
  listCaisseRslt = new Array<any>();
  // selectedCaisse: any;
  listBanqueRslt = new Array<any>();
  selectedModeReglement: any;
  selectedSociete: any = null;
  selectedSocieteNew: any = null;
  selectedConvention: any = null;
  selectedConventionNew: any = null;
  listModeReglementRslt = new Array<any>();
  ListSocieteRslt = new Array<any>();
  ListConventionRslt = new Array<any>();
  AraiaDis: boolean = false;
  TotalAvance: number = 0;
  TotalAvanceEnDevisePrincipal: number = 0;
  TotalEnDevisePrincipal: number = 0
  TotalTaxe: any;
  listAvanceFournisseurNonApurer = new Array<any>();
  selectedAvanceFournisseur: any;
  ListDetailsTaxe = new Array<any>();
  listselectedTaxeRslt = new Array<any>();
  selectedTaxe: any;
  selectedReglementFactureFournisseur: any;
  v2: boolean = false;
  listFournisseurRslt = new Array<any>();
  SelectedPatient: any;
  SelectedPatients: any;
  SpecialiteMedecin: any;
  NomMedecin: any;
  NomCabinet: any;
  MontantTotal: any;
  selectedValue: any = 0;
  selectedValueNew: any = 0;
  mntCash: any = 0;
  mntPEC: any = 0;
  mntReqPayed: any = 0;
  mntPayed: any = 0;
  HeaderRecherchePatient = '';
  HeaderListPatient = '';
  nomFullArNew = '';
  nomFullLtNew = '';
  TelPatientNew = '';
  NomFullArAdm = '';
  NomFullLtAdm = '';
  TelPatientAdm = '';
  dateNaissanceNew: any;
  dateNaissanceAdm: string | Date = '';
  dateNaissanceRecherche: string | Date = '';

  codePriceListCashFromData: any;
  // codeNatureAdmissionOPDFromData: any;

  SourceDeFinancement = 'SourceDeFinancement';
  visbileModalPassword = false;
  DateNaiss = 'DateNaiss';
  codePriceListTemp = "NULL";

  DateTempNew: any;

  DateTempRecherche: any;

  dataSociete = new Array<any>();
  listSocietePushed = new Array<any>();

  ListMedecinTriedTemp: any;
  ListPrestationMedecinConsultationTemp: any;
  codePrestationConsultationMedecinTemp: any;
  prestationConsultation: any;

  dataModeRegelement = new Array<any>();
  dataModeRegelementPushed = new Array<any>();


  dataBanque = new Array<any>();
  dataBanquePushed: any[] = [];
  dataAdmission = new Array<any>();


  RegDeferral = false;
  RegDef = false;

  constructor(private encryptionService: EncryptionService, private CtrlAlertify: ControlServiceAlertify, private calandTrans: CalanderTransService,
    private datePipe: DatePipe, private validationService: InputValidationService,
    public i18nService: I18nService, private router: Router, private loadingComponent: LoadingComponent,
    private cdr: ChangeDetectorRef, private recept_service: ReceptionService, private param_service: ParametargeService) {
    this.calandTrans.setLangAR();


  }


  onRowSelectFromTabsRecherchePatient(event: any) {
    // const SelectedPatients = event.data;
    // this.SelectedPatients = SelectedPatients;
    this.SelectedPatientFromList = event.data.code;
    this.NomFullArAdm = event.data.nomCompltAr;
    this.IDPatient = event.data.codeSaisie;
    this.NomFullLtAdm = event.data.nomCompltLt;
    this.TelPatientAdm = event.data.numTel;
    this.selectedConvention = event.data.codeConvention;
    this.selectedSociete = event.data.codeSociete;
    this.codePriceList = event.data.codePriceList;

    if (event.data.codeSociete == null && event.data.codeConvention == null) {
      this.selectedValue = 1;
      this.VisiblePEC = false;
      console.log("Patietn Cash");
    } else {
      this.selectedValue = 2;
      this.VisiblePEC = true;
      console.log("Patietn PEC");
    }


  }


  onRowSelectFromTabsMedecin(event: any) {

    if (this.selectedValue == 2 && this.selectedConvention == null || this.selectedValue == 2 && this.selectedSociete == null) {


      this.CtrlAlertify.showNotificationِCustom('selctedAnyConventionOrSociete')
      this.CtrlAlertify.PostionLabelNotification();

    } else {

      if (this.selectedValue == 1) {
        this.mntCash = event.data.montantConsultation;
        this.mntPEC = 0;
        this.mntReqPayed = event.data.montantConsultation;
        this.mntPayed = event.data.montantConsultation;
        console.log("SelectedMedecinFromList  ", this.SelectedMedecinFromList)
      } else {

        if (this.selectedConvention == "" || this.selectedConvention == undefined || this.selectedConvention == null) {

          this.CtrlAlertify.showNotificationِCustom('selctedAnyConventionOrSociete')
          this.CtrlAlertify.PostionLabelNotification();
        } else {
          const conventionSelected = this.dataConvention.find(m => m.code === this.selectedConvention);

          const codeNatureAdmissionOPd = sessionStorage.getItem("NatureAdmissionOPD");
          this.param_service.GetDetailsListCouverturePrestationByCodeListCouvertureAndCodePrestationAndCodeNatureAdmission(conventionSelected.codeListCouverture, this.SelectedMedecinFromList.medecinDTO.prestationConsultationDTO.codePrestation, codeNatureAdmissionOPd).subscribe(
            (data: any) => {
              console.log("data couverure", data);
              console.log("SelectedMedecinFromList  ", this.SelectedMedecinFromList)
              this.mntCash = data.montantPatient;
              this.mntPEC = data.montantPEC;
              this.mntReqPayed = data.montantPatient;
              this.mntPayed = data.montantPatient;

            })
        }

        // GetDataFromConventionEtListCouverture


      }






      console.log("Ok medecin", event.data);
    }




  }


  onRowUnselectFromTabsRecherPatient(event: any) {
    this.selectedTotal = new Array<any>();
    this.Total = 0
    this.NomPatientFullAr = 'NULL',
      this.codePriceList = 0;
    this.NomPatientFullLt = 'NULL'
    this.TelPatient = '';
    this.selectedSociete = '';
    this.selectedConvention = '';
    this.selectedValue = 1;
    this.VisiblePEC = false;
    this.dateNaissance = new Date();;
  }


  onRowUnselectFromTabsMedecin(event: any) {
    this.SelectedPatients = null;
    this.Total = 0;


  }


  columnTabsListPatient!: any[];
  columnsListPatient() {
    this.columnTabsListPatient = [

      // { field: '', header: '' },
      { field: 'codePatient', header: this.i18nService.getString('CodePatient') },
      { field: 'NomFullAr', header: this.i18nService.getString('NomFullAr') },
      { field: 'NomFullLt', header: this.i18nService.getString('NomFullLt') },
      { field: 'TelPatient', header: this.i18nService.getString('NumTel') },
      { field: 'DateNais', header: this.i18nService.getString('DateNaiss') }

    ];


  }


  columnTabsListMedecin!: any[];
  columnsListMedecin() {
    this.columnTabsListMedecin = [

      // { field: '', header: '' },
      { field: 'codeMedecin', header: this.i18nService.getString('CodeMedecin') },
      { field: 'NomFullArMedecin', header: this.i18nService.getString('NomFullAr') },
      { field: 'NomFullLtMedecin', header: this.i18nService.getString('NomFullLt') },
      { field: 'specialite_medecin', header: this.i18nService.getString('SpecialiteMedecin') },
      { field: 'Cabinet', header: this.i18nService.getString('CabinetDesgiantion') },
      { field: 'montantConsultation', header: this.i18nService.getString('montantConsultation') }

    ];


  }

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];

  ngOnInit(): void {


    sessionStorage.removeItem("CodePatientTemp");
    sessionStorage.removeItem("ListCouvertureTemp");
    sessionStorage.removeItem("PriceListTempSelectedTemp");
    sessionStorage.removeItem("CodePatientTemp");
    this.GetParamCheckRegDef();
    // this.GetColumns();
    this.GetAllAdmission();
    this.GetColumnsParent();

    this.listDeviseRslt = [
      { label: 'test', value: 'v1' },
      { label: 'test2', value: 'v2' },
    ]

    // this.listModeReglementRslt = [
    //   { label: 'cash', value: '1' },
    //   { label: 'Cheque', value: '2' },
    // ]
    // this.listBanqueRslt = [
    //   { label: 'banque1', value: 1 },
    //   { label: 'banque2', value: 2 },
    // ]
    // this.ListConventionRslt = [
    //   { label: 'conv1', value: '123', },
    //   { label: 'conv2', value: '145', },
    //   { label: 'conv3', value: '156' },
    //   { label: 'conv4', value: '225', },
    //   { label: 'conv5', value: '453', },
    //   { label: 'conv6', value: '70', },
    // ]
    // this.ListSocieteRslt = [
    //   { label: 'SOC1', value: '1', },
    //   { label: 'SOC2', value: '15', },
    //   { label: 'SOC3', value: '9' },
    //   { label: 'SOC4', value: '3', },
    //   { label: 'SOC5', value: '5', },
    // ]

    // this.ListSocieteRslt = [
    //   { label: 'SOC1', value: '1', },
    //   { label: 'SOC2', value: '15', },
    //   { label: 'SOC3', value: '9' },
    //   { label: 'SOC4', value: '3', },
    //   { label: 'SOC5', value: '5', },
    // ]

  }




  // validateInput(input: HTMLInputElement) {
  //   if (input.required && input.value === '') {
  //     input.style.borderColor = 'red'; // Or any color you prefer
  //     input.classList.add('invalid-input'); // Add a class for more styling options
  //   } else {
  //     input.style.borderColor = ''; // Reset border color
  //     input.classList.remove('invalid-input'); // Remove the invalid class
  //   }
  // }


  // GetColumns() {
  //   this.cols = [
  //     { field: 'TypeOP', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '5%', filter: "true" },
  //     { field: 'SourceDepenese', header: this.i18nService.getString('Designation') || 'Designation', width: '5%', filter: "true" },
  //     { field: 'codeEtatApprouver', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '5%', filter: "false" },
  //     { field: 'dateCreate', header: this.i18nService.getString('LabelActif') || 'Actif', width: '5%', filter: "true" },

  //   ];
  // }
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
    this.SelectedMedecinFromList = '';
    this.SelectedPatientFromList = '';
    this.codeConvention = null;
    this.codeSociete = null;
    this.NomFullArAdm = '';
    this.NomPatientFullArRecherche = 'NULL';
    this.NomFullLtAdm = '';
    this.NomPatientFullLtRecherche = 'NULL';
    this.TelPatientAdm = '';
    this.TelPatientRecherche = '';
    this.codePriceList == 0;
    this.selectedBanque = "";
    this.numPiece = "";
    this.selectedModeReglement = '';
    this.mntCash = '';
    this.mntPEC = '';
    this.mntPayed = '';
    this.mntReqPayed = '';
    this.dateNaissanceAdm = "";
    this.dateNaissanceNew = "";
    this.dateNaissanceRecherche = "";
    this.nomFullArNew = '';
    this.nomFullLtNew = '';
    this.TelPatientNew = '';
    this.selectedValueNew = 0;
    this.IDPatient = '';
    this.codePatientNew = '';
    this.codeConvention = null;
    this.ListMedecinTried = new Array<any>();
    this.codePrestationConsultationMedecinTemp = "";
    this.prestationConsultation = "";
    this.ListMedecinTriedTemp = "";
    this.ListPrestationMedecinConsultationTemp = "";
    this.onRowUnselect(event);

  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  searchTerm = '';
  designationAr: string = 'NULL';
  designationLt: string = "NULL";

  codePatient = 'NULL';
  codePatientNew = '';
  IDPatient = 'NULL';
  // rib!: string;
  actif!: boolean;
  visible!: boolean;
  dateNaissance!: Date;
  selectedBanque: any = null;


  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt;
    // this.rib = event.data.rib;

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

  LabelActif!: string;
  LabelRegDefferral = "";
  public onOpenModalX(mode: string) {

    this.LabelActif = this.i18nService.getString('LabelActif');
    this.visibleModal = false;
    this.visDelete = false;
    this.visibleModalPrint = false;
    this.visibleModalAddPatient = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.columnsListPatient();
    this.columnsListMedecin();
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = this.i18nService.getString('Add');
      this.onRowUnselect(event);
      this.clearSelected();
      this.actif = false;
      this.visible = false;
      this.visibleModalRecherPatient = false;
      this.visibleModal = true;
      this.code == undefined;


    } else
      if (mode === 'edit') {


        if (this.code == undefined) {
          this.clearForm();
          this.onRowUnselect(event);
          // if (sessionStorage.getItem("lang") == "ar") {
          //   alertifyjs.notify(
          //     `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >`

          //   );
          //   alertifyjs.set('notifier', 'position', 'top-left');
          // } else {
          //   alertifyjs.set('notifier', 'position', 'top-right');
          //   alertifyjs.notify(
          //     `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >`
          //   );
          // }
          this.CtrlAlertify.PostionLabelNotification();
          this.CtrlAlertify.showChoseAnyRowNotification();
          this.visDelete == false && this.visibleModal == false
        } else {

          button.setAttribute('data-target', '#Modal');
          this.formHeader = this.i18nService.getString('Modifier');

          this.visibleModal = true;
          this.onRowSelect;

        }

      } else

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
        else
          if (mode === 'Print') {
            if (this.code == undefined) {
              this.onRowUnselect;
              this.CtrlAlertify.PostionLabelNotification();
              this.CtrlAlertify.showChoseAnyRowNotification();
              this.visDelete == false && this.visibleModal == false && this.visibleModalPrint == false
            } else {
              button.setAttribute('data-target', '#ModalPrint');
              this.formHeader = "Imprimer Liste Banque"
              this.visibleModalPrint = true;
              // this.RemplirePrint();

            }




          } else if (mode === 'RercherPatient') {
            button.setAttribute('data-target', '#ModalRercherPatient');
            this.formHeader = this.i18nService.getString('Add');
            this.onRowUnselect(event);
            this.clearSelected();
            this.actif = false;
            this.visible = false;
            this.visibleModal = false;
            this.visibleModalRecherPatient = true;
            // this.GetAllPatient();
            this.code == undefined;

          }

  }


  OpenModalRercherPatient(mode: string) {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.columnsListPatient();
    this.HeaderRecherchePatient = this.i18nService.getString('HeaderRecherchePatient');
    this.HeaderListPatient = this.i18nService.getString('HeaderListPatient');
    this.columnsListMedecin();
    if (mode === 'RercherPatient') {
      button.setAttribute('data-target', '#ModalRercherPatient');
      this.formHeader = this.i18nService.getString('Add');
      this.onRowUnselect(event);
      this.clearSelected();
      this.actif = false;
      this.visible = false;
      this.visibleModal = false;
      this.visibleModalAddPatient = false;
      this.visibleModalRecherPatient = true;
      this.GetAllPatient();
      this.code == undefined;
      this.dateFactureFournisseur = '';
      this.NomPatientFullLtRecherche = '';
      this.NomPatientFullArRecherche = '';
      this.TelPatientRecherche = ''

    }
  }


  onOpenModalAdmission(mode: string) {

    const sessionValue = sessionStorage.getItem("CheckRegDef");
    const checkedRegDef = sessionValue === "true";
    this.visibleModal = false;
    this.visDelete = false;
    this.visibleModalPrint = false;
    this.visibleModalAddPatient = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.LabelRegDefferral = this.i18nService.getString('LabelRegDefferral');

    this.RegDef = checkedRegDef;
    if (mode === 'choisir') {

      if (this.NomFullArAdm === '' || this.codePriceList == 0) {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showChoseAnyPatientNotification();
        this.visibleModal = false;
      } else {
        button.setAttribute('data-target', '#Modal');
        this.formHeader = this.i18nService.getString('Add');
        this.onRowUnselect(event);
        this.clearSelected();

        if (this.codeConvention == 'NULL' && this.codeSociete == 'NULL') {
          this.selectedValue == 1;
          this.codePriceList = 200;
          this.codeConvention = "NULL";
          this.codeSociete = "NULL";
        } else {
          this.codePriceList = this.codePriceList;
          this.selectedConvention = this.codeConvention;
          this.selectedSociete = this.codeSociete;
          this.selectedValue == 2;
        }
        sessionStorage.setItem("CodePatientTemp", this.SelectedPatientFromList);
        this.visibleModalRecherPatient = false;
        this.getCodeSaisieAdmissionOPD();



        this.RegDeferral = checkedRegDef;
        this.visibleModal = true;
        this.GetAllMedecinContientConsultation();
        if (sessionStorage.getItem("CheckRegDef") == "false") {
          this.GetAllModeReglement();
        }


        this.code == undefined;

      }

    } else if (mode === 'addNewPatient') {
      button.setAttribute('data-target', '#ModalAddPatient');
      this.formHeader = this.i18nService.getString('AddNewPatient');
      this.onRowUnselect(event);
      this.clearSelected();
      this.visibleModalRecherPatient = false;
      this.visibleModal = false;
      this.visibleModalAddPatient = true;
      // this.selectedValueNew =1 ;
      // this.GetCodePriceListCash();
      // this.codePriceList = this.codePriceListCashFromData;
      this.GetCompteurPatient();
      this.codePatient = '';
      this.NomPatientFullAr = '';
      this.NomPatientFullLt = '';
      this.selectedConvention = '';
      this.selectedSociete = '';
      this.selectedValue = 1;
      this.TelPatient = '';
      this.VisiblePEC = false;
      this.code == undefined;



    }


  }
  formatInput(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTemp = inputValue;
    this.tryParseAndSetDate(inputValue);
  }
  tryParseAndSetDate(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        this.dateFactureFournisseur = new Date(year, month, day);
      }
    }
  }
  // transformDateFormat() {
  //   if (this.dateFactureFournisseur) {
  //     this.DateTemp = this.datePipe.transform(this.dateFactureFournisseur, 'dd/MM/yyyy')!;
  //     console.log("transformDateFormat: ", this.dateFactureFournisseur);
  //   }
  // };

  transformDateFormat() {
    this.dateNaissanceNew = this.datePipe.transform(this.dateNaissanceNew, "yyyy-MM-dd")
  };


  userCreate = sessionStorage.getItem("userName");



  private validateAllInputsAddAdmission(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeInputElement, this.codeSaisie);
    const codePatient = this.validationService.validateInputCommun(this.iDPatientInputElement, this.IDPatient);
    const mntPayed = this.validationService.validateInputCommun(this.mntPayedInputElement, this.mntPayed);
    // const modReg = this.validationService.validateDropDownCommun(this.modeReglementInputElement, this.selectedModeReglement);

    return codeSaisie && codePatient && mntPayed;
  }



  detailsAdmission = new Array<any>();
  admissionFacturation = new Array<any>();
  reglementPused = new Array<any>();
  AdmissionFacturationPush = new Array<any>();
  PostAdmission() {

    if (this.SelectedMedecinFromList == "" || this.SelectedMedecinFromList == null) {

      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom("PleaseSelectAnyMedecin")
    } else {

      const isValid = this.validateAllInputsAddAdmission();

      if (isValid) {

        this.detailsAdmission.push({
          codePrestation: this.SelectedMedecinFromList.medecinDTO.prestationConsultationDTO.codePrestation,
          montant: this.SelectedMedecinFromList.montantConsultation,
          montantPatient: this.mntCash,
          montantPEC: this.mntPEC,
          etatPaiement: false
        })



        // this.admissionFacturation.push({
        //   codePrestation: this.SelectedMedecinFromList.medecinDTO.prestationConsultationDTO.codePrestation,
        //   montant: this.SelectedMedecinFromList.montantConsultation,
        //   montantPatient: this.mntCash,
        //   codeNatureAdmission: sessionStorage.getItem("NatureAdmissionOPD"),
        //   codeEtatPaiement: 2,
        //   codeEtatPatient:0
        // })


        if (this.RegDeferral == false) {
          this.reglementPused.push({
            codePrestation: this.SelectedMedecinFromList.medecinDTO.prestationConsultationDTO.codePrestation,
            montantBon: this.SelectedMedecinFromList.montantConsultation,
            montantReglement: this.mntPayed,
            montantPEC: this.mntPEC,
            dateReglement: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
            typeReglement: "REGLEMENT",
            codeNatureAdmission: sessionStorage.getItem("NatureAdmissionOPD"),
            codeModeReglement: this.selectedModeReglement,
            caissier: this.userCreate,
            codeBanque: this.selectedBanque,
            numPiece: this.numPiece
          })
        } else {

        }

        this.AdmissionFacturationPush.push({
          dateCreate: new Date().toISOString(),
          userCreate: this.userCreate,
          codeSociete: this.selectedSociete,
          codeConvention: this.selectedConvention,
          codeNatureAdmission: sessionStorage.getItem("NatureAdmissionOPD"),
          codeEtatPatient: 0
        })
        let bodyAdmission = {
          codeSaisie: this.codeSaisie,
          codePatient: sessionStorage.getItem("CodePatientTemp"),
          codeNatureAdmission: sessionStorage.getItem("NatureAdmissionOPD"),
          codeMedecin: this.SelectedMedecinFromList.codeMedecin,
          codeMotifAdmission: 1,
          codeSociete: this.selectedSociete,
          codeConvention: this.selectedConvention,
          codeListCouverture: sessionStorage.getItem("ListCouvertureTemp"),
          codeCabinet: this.SelectedMedecinFromList.codeCabinet,
          codePriceList: sessionStorage.getItem("PriceListTempSelectedTemp"),
          dateCreate: new Date().toISOString(), //
          code: this.code,
          userCreate: this.userCreate,
          detailsAdmissionDTOs: this.detailsAdmission,
          reglementDTOs: this.reglementPused,
          regDeferral: this.RegDeferral,
          admissionFacturationDTOs: this.AdmissionFacturationPush,
        }
        // console.log("this.SelectedMedecinFromList"), this.SelectedMedecinFromList;


        if (this.code != null) {
          bodyAdmission['code'] = this.code;

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
          // console.log("body to post ", bodyAdmission);
          // console.log( " body details admission " , bodyDetailsAdmission)
          this.recept_service.PostAdmission(bodyAdmission).pipe(
            catchError((error: HttpErrorResponse) => {
              let errorMessage = '';
              this.reglementPused = new Array<any>();
              this.detailsAdmission = new Array<any>();
              this.AdmissionFacturationPush = new Array<any>();

              return throwError(errorMessage);

            })
          ).subscribe(
            (res: any) => {

              this.CtrlAlertify.PostionLabelNotification();
              this.CtrlAlertify.ShowSavedOK();
              this.visibleModal = false;
              this.detailsAdmission = new Array<any>();
              this.reglementPused = new Array<any>();
              this.AdmissionFacturationPush = new Array<any>();

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
        // }

        // }
      } else {
        this.reglementPused = new Array<any>();
        this.detailsAdmission = new Array<any>();
        console.log("Error Validation");

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
    // console.log(index);
  }






  compteur: number = 0;
  listDesig = new Array<any>();

  // cars!: Array<Matiere>;
  // brands!: SelectItem[];
  // clonedCars: { [s: string]: Matiere } = {}; 
  // dataBanque = new Array<any>();
  // GetAllBanque() {
  //   // this.param_service.GetBanque().subscribe((data: any) => {

  //   this.loadingComponent.IsLoading = false;
  //   this.IsLoading = false;

  //   //   this.dataBanque = data;
  //   //   this.onRowUnselect(event);

  //   // }) 
  // }




  ///////////////////////////////// newwww modall admissionnn 

  CloseModalRecherPatient() {
    this.visibleModalRecherPatient = false;
    this.codeConvention == "NULL";
    this.codeSociete == "NULL";
    this.NomPatientFullAr == "NULL";
    this.NomPatientFullLt == "NULL";
    this.SelectedPatientFromList = '';
    this.SelectedMedecinFromList = '';
    this.dateNaissanceAdm = new Date();
    this.dateNaissanceNew = new Date();
    this.dateNaissanceRecherche = new Date();
    this.codePriceList == 0;
  }

  GetBanqueIfNeed() {
    const modRegSelected = this.dataModeRegelement.find(m => m.code === this.selectedModeReglement);

    if (modRegSelected.reqBanque == false) {
      this.DisBanque = true;
      this.selectedBanque = null;
      this.numPiece = '';

    } else {
      this.DisBanque = false;
      this.DisCaisse = true;
      this.GetAllBanque();
      // this.selectedCaisse = null;
    }


  }
  VisiblePEC: boolean = false;
  GetIfNeedSocForAddAdmission() {

    const encryptedValue = sessionStorage.getItem('PassCashPEC');
    if (encryptedValue) {

      this.decryptedValue = this.encryptionService.decrypt(encryptedValue);

    } else {
      this.decryptedValue = 'No value found in session storage';
    }
    if (this.password != this.decryptedValue) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom("PasswordError");




    } else {
      this.password = "";

      this.visbileModalPassword = false;
      if (this.selectedValue === 1) {
        this.selectedValue = 2
        this.SelectedMedecinFromList = '';
        this.mntCash = 0;
        this.mntPEC = 0;
        this.mntPayed = 0;
        this.mntReqPayed = 0;
        this.VisiblePEC = true;
        sessionStorage.removeItem("PriceListTempSelectedTemp");
        sessionStorage.removeItem("ListCouvertureTemp");
        this.GetSociete();
        this.GetAllMedecinContientConsultation();
      } else {
        this.selectedValue = 1;
        this.VisiblePEC = false;
        this.SelectedMedecinFromList = '';
        this.selectedConvention = "";
        this.selectedSociete = "";
        this.GetAllMedecinContientConsultation();
      }
    }



  }

  GetCodePriceListFromConventionSelected(codeConvention: number) {
    if (this.selectedValueNew != 1) {
      this.param_service.GetConventionByCode(codeConvention).subscribe((data: any) => {
        this.codePriceList = data.codePriceList;

        console.group("code pl ", this.codePriceList)
      })
    }

  }

  GetIfNeedSocForAddPatient() {
    if (this.selectedValueNew == 1) {
      this.VisiblePEC = false;
      this.SelectedMedecinFromList = "";
      this.codePriceList = 1;

    } else {
      this.SelectedMedecinFromList = "";
      this.mntCash = 0;
      this.mntPEC = 0;
      this.mntPayed = 0;
      this.mntReqPayed = 0;

      this.GetSociete();
      this.VisiblePEC = true;
    }
  }
  selctedPriceListConvention: any;
  GetDetailsConventionSelected() {

    this.param_service.GetConventionByCode(this.selectedConvention).subscribe((date: any) => {
      this.selctedPriceListConvention = date.codePriceList;
      sessionStorage.setItem("ListCouvertureTemp", date.codeListCouverture);

    }

    );
    this.GetAllMedecinContientConsultation();

  }

  // GetConventionByCodeSocieteSelected(selectedSocieteCode: number) {
  //   this.selectedConvention = '';
  //   this.param_service.GetConventionByCodeSociete(selectedSocieteCode).subscribe((data:any)=>
  //   {
  //     this.dataConvention = data;
  //     this.listConventionPushed = [];
  //     for (let i = 0; i < this.dataConvention.length; i++) {
  //       this.listConventionPushed.push({ label: this.dataConvention[i].designationAr, value: this.dataConvention[i].code })
  //     }
  //     this.ListConventionRslt = this.listConventionPushed;

  //   });
  // }

  dataConvention = new Array<any>();
  listConventionPushed: any;
  GetListConventionFromSociete(codeSociet: number) {
    this.selectedConvention = "";
    this.param_service.GetConventionByCodeSociete(codeSociet).subscribe((data: any) => {
      this.dataConvention = data;
      this.listConventionPushed = [];
      for (let i = 0; i < this.dataConvention.length; i++) {
        this.listConventionPushed.push({ label: this.dataConvention[i].designationAr, value: this.dataConvention[i].code })
      }
      this.ListConventionRslt = this.listConventionPushed;
    })



  }

  ReinitialiserSearch() {
    this.dateFactureFournisseur = '';
    this.NomPatientFullLt = '';
    this.NomPatientFullAr = '';
    this.TelPatient = ''
  }


  CloseAddModalRecherche() {
    this.visibleModalAddPatient = false;
    this.IDPatient = '';
    this.codeSaisie = '';
    this.SelectedMedecinFromList = '';
    this.SelectedPatientFromList = '';
    this.codeConvention = 'NULL';
    this.codeSociete = 'NULL';
    this.NomFullArAdm = '';
    this.NomPatientFullArRecherche = 'NULL';
    this.NomFullLtAdm = '';
    this.NomPatientFullLtRecherche = 'NULL';
    this.TelPatientAdm = '';
    this.TelPatientRecherche = '';
    this.codePriceList == 0;
    this.selectedBanque = "";
    this.numPiece = "";
    this.selectedModeReglement = '';
    this.mntCash = '';
    this.mntPEC = '';
    this.mntPayed = '';
    this.mntReqPayed = '';
    this.dateNaissanceAdm = "";
    this.dateNaissanceNew = "";
    this.dateNaissanceRecherche = "";
    this.nomFullArNew = '';
    this.nomFullLtNew = '';
    this.TelPatientNew = '';
    this.selectedValueNew = 0;
    this.codePatientNew = '';
  }


  // private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
  //   const codeValid = this.validatecodePatientNewInput();
  //   const nomArValid = this.validatenomFullArNewInput();
  //   const nomLtValid = this.validatenomFullLtNewInput();
  //   const telValid = this.validateTelPatientNewInput();

  //   return codeValid && nomArValid && nomLtValid && telValid;
  // }

  PostNewPatient() {
    const isValid = this.validateAllInputs();

    if (this.dateNaissanceNew == "") {
      this.validationService.showRequiredNotificationWithParam(this.DateNaiss);
    } else

      if (this.selectedValueNew == 0) {
        this.validationService.showRequiredNotificationWithParam(this.SourceDeFinancement);
      }
      else if (this.selectedValueNew == 2 && this.selectedConventionNew == null) {
        this.validationService.showRequiredNotificationWithParam("ConventionOblgatoire");
      }
      else {
        if (isValid) {  // Open modal only if ALL validations pass


          let body = {
            codeSaisie: this.codePatientNew,
            nomCompltAr: this.nomFullArNew,
            nomCompltLt: this.nomFullLtNew,
            numTel: this.TelPatientNew.toString(),
            userCreate: this.userCreate,
            codeConvention: this.selectedConventionNew,
            codeSociete: this.selectedSocieteNew,
            codePriceList: this.codePriceList,
            dateNaissance: this.dateNaissanceNew,
            dateCreate: new Date().toISOString(), //
            code: this.code,
            actif: this.actif,

          }
          // console.log("body to post new patient " , body)
          this.recept_service.PostPatient(body).subscribe(
            (res: any) => {
              // this.CtrlAlertify.PostionLabelNotification();
              // this.CtrlAlertify.ShowSavedOK();
              // this.visibleModal = false;
              // this.clearForm();
              // this.ngOnInit();
              // this.code;
              // this.onRowUnselect(event);
              // this.clearForm();
              this.IDPatient = this.codePatientNew;
              this.NomFullArAdm = this.nomFullArNew;
              this.NomFullLtAdm = this.nomFullLtNew;
              this.TelPatientAdm = this.TelPatientNew;
              this.selectedConvention = this.selectedConventionNew;
              this.selectedSociete = this.selectedSocieteNew;
              this.selectedValue = this.selectedValueNew;



            }
          )


          this.LabelActif = this.i18nService.getString('LabelActif');
          const button = document.createElement('button');
          button.type = 'button';
          button.style.display = 'none';
          button.setAttribute('data-toggle', 'modal');
          this.columnsListPatient();
          this.columnsListMedecin();
          button.setAttribute('data-target', '#Modal');
          this.formHeader = this.i18nService.getString('Add');
          this.onRowUnselect(event);
          this.clearSelected();
          this.actif = false;
          this.visible = false;
          this.visibleModalRecherPatient = false;
          this.visibleModalAddPatient = false;
          this.visibleModal = true;
          this.selectedValue = this.selectedValueNew;
          this.code == undefined; // What is this for? Consider removing if unnecessary

        } else {
          console.log("Error input ")
        }
      }







  }

  formatInputNew(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempNew = inputValue;
    this.tryParseAndSetDateNew(inputValue);
  }
  tryParseAndSetDateNew(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        this.dateNaissanceNew = new Date(year, month, day);
      }
    }
  }
  transformDateFormatNew() {
    if (this.dateNaissanceNew) {
      this.DateTempNew = this.datePipe.transform(this.dateNaissanceNew, 'dd/MM/yyyy')!;
    }
  };

  formatInputRecherche(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempRecherche = inputValue;
    this.tryParseAndSetDateRecherche(inputValue);
  }
  tryParseAndSetDateRecherche(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        this.dateNaissanceRecherche = new Date(year, month, day);
      }
    }
  }
  transformDateFormatRecherche() {
    if (this.dateNaissanceRecherche) {
      this.DateTempRecherche = this.datePipe.transform(this.dateNaissanceRecherche, 'dd/MM/yyyy')!;
    }
  };


  GetSociete() {
    this.param_service.GetSocieteActif().subscribe((data: any) => {
      this.dataSociete = data;
      this.listSocietePushed = [];
      for (let i = 0; i < this.dataSociete.length; i++) {
        this.listSocietePushed.push({ label: this.dataSociete[i].designationAr, value: this.dataSociete[i].code })
      }
      this.ListSocieteRslt = this.listSocietePushed;
    })
  }


  dataPatient = new Array<any>();
  listPatientPushed = new Array<any>();
  GetAllPatient() {
    this.recept_service.GetPatient().subscribe((data: any) => {
      this.ListPatientTried = data;
      // this.listPatientPushed = [];
      // for (let i = 0; i < this.dataPatient.length; i++) {
      //   this.listPatientPushed.push({ label: this.dataPatient[i].nom, value: this.dataPatient[i].code })
      // }
      // this.ListPatientTried = this.listPatientPushed;
    })
  }


  GetCompteurPatient() {
    this.param_service.GetCompteur("CompteurPatient").subscribe((data: any) => {
      this.codePatientNew = data.prefixe + data.suffixe;
    })
  }

  GetCodePriceListCash() {
    this.param_service.GetParam("PriceListCash").subscribe((data: any) => {
      this.codePriceListCashFromData = data.valeur;
    });
    // this.GetParamCheckRegDef();
  }

  GetParamCheckRegDef() {
    this.param_service.GetParam("RegDeferralChecked").subscribe((dataRegChecked: any) => {
      sessionStorage.setItem("CheckRegDef", dataRegChecked.valeur);
    })


  }

  // GetCodeNatureAdmissionOPD() {
  //   this.param_service.GetParam("CodeNatureAdmissionOPD").subscribe((data: any) => {
  //     this.codeNatureAdmissionOPDFromData = data.valeur;
  //   })
  // } 
  // GetAllMedecinContientConsultation() {
  //   this.param_service.GetMedecinActifAndHaveConsultationOpdAndER(true, false).subscribe((prestationData: any) => {

  //     this.ListMedecinTriedTemp = prestationData;


  //     for (let i = 0; i < this.ListMedecinTriedTemp.length; i++) {
  //       this.param_service.GetPrestationConsultationByCodeMedecinAndCodeNatureAdmission(this.ListMedecinTriedTemp[i].code, this.codeNatureAdmissionOPDFromData).subscribe((datax: any) => {

  //         this.codePrestationConsultationMedecinTemp = datax.codePrestation;
  //         this.prestationConsultation = datax;
  //         if (this.codeConvention != null || this.codeConvention != undefined) {
  //           console.log(" patient PEC ListMedecinTriedTemp ")
  //           this.param_service.GetDetailsListCouverturePrestationByCodeListCouvertureAndCodePrestation(this.codeConvention, this.codePrestationConsultationMedecinTemp).subscribe((dataDetailsCouverture: any) => {
  //             this.ListMedecinTriedTemp[i].montantConsultation = dataDetailsCouverture.montantPEC;
  //           })
  //         }
  //         /// patient Cash
  //         else {
  //           console.log(" patient Cash ListMedecinTriedTemp ")
  //           this.param_service.GetParam("PriceListCash").subscribe((DataPlCash: any) => {
  //             this.param_service.GetDetailsPriceListByCodePriceListAndCodePrestationAnd(DataPlCash.valeur, this.ListMedecinTriedTemp[i].prestationConsultationDTO.codePrestation, this.codeNatureAdmissionOPDFromData).subscribe((dataDetailsPL: any) => {

  //               this.ListMedecinTriedTemp[i].montantConsultation = this.sumMontantFromDetails(dataDetailsPL);
  //               console.log("this.codePrestationConsultationMedecinTemp.prestationDTO    ", this.prestationConsultation)


  //               if (this.prestationConsultation.prestationDTO.opd == true) {
  //                 this.ListMedecinTried = this.ListMedecinTriedTemp;

  //               } else {
  //                 console.log("dataDetailsPL.ssssssssss    ")
  //                 this.ListMedecinTriedTemp.splice(i, 1);
  //               }

  //             })
  //           })
  //         }
  //       })
  //     }
  //   })
  // }


  // sumMontantFromDetails(details: any[]): number {

  //   if (!details || !Array.isArray(details) || details.length === 0) {
  //     return 0; //Handle empty or invalid data gracefully
  //   }
  //   return details.reduce(
  //     (sum, detail) =>
  //       sum + (detail.montant || 0), 0);
  //   //Added nullish coalescing to avoid errors if montant is missing
  // }


  sumMontantFromDetails(details: any[]): number {
    if (!details || !Array.isArray(details) || details.length === 0) {
      return 0;
    }
    if (!this.selectedConvention && this.selectedValue == 2) {
      return 0; //Condition met, return 0
    } else {
      return details.reduce((sum, detail) => sum + (detail.montant || 0), 0);
    }
  }

  async GetAllMedecinContientConsultation() {
    try {
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, "yyyy-MM-dd");
      const natureAdmOPD = sessionStorage.getItem("NatureAdmissionOPD");
      const codeNatAdmOPD = Number(natureAdmOPD);

      // Fetch codeConvention and PriceListCash concurrently
      const [planningCabinets, priceListCashResult] = await Promise.all([
        this.recept_service.GetPlanningCabinetByDateExiste(formattedDate, formattedDate).toPromise(), // toPromise() for async/await
        // this.param_service.GetParam("codeConvention").toPromise(), // Assuming you have a method to fetch codeConvention

        this.param_service.GetParam("PriceListCash").toPromise(),
      ]);

      this.codeConvention = this.selectedConvention; // Assign the results
      const priceListCashValue = priceListCashResult.valeur; // Assuming the value is in 'valeur' property

      if (planningCabinets.length === 0) {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showNotificationِCustom("NoPlanningInThisDay");
        this.ListMedecinTried = [];
        return;
      }

      const consultationData = await this.fetchConsultationData(planningCabinets, codeNatAdmOPD, priceListCashValue);

      this.ListMedecinTried = consultationData;
      if (this.ListMedecinTried.length === 0) {
        console.log("No médecins found with consultations");
      }

    } catch (error) {
      console.error("Error fetching médecin data:", error);
      // Handle errors appropriately (e.g., display an error message to the user)
    }
  }



  //Helper Function to improve readability and maintainability.
  async fetchConsultationData(planningCabinets: any[], codeNatAdmOPD: number, priceListCashValue: any) {
    const requests = planningCabinets.map(medecin =>
      this.param_service.GetPrestationConsultationByCodeMedecinAndCodeNatureAdmission(medecin.codeMedecin, codeNatAdmOPD)
        .pipe(
          map((datax: any) => ({ medecin, codePrestation: datax.codePrestation }))
        )
    );

    const consultationData = await Promise.all(requests.map(obs => firstValueFrom(obs)));


    const priceRequests = consultationData.map(({ medecin, codePrestation }) => {
      if (this.codeConvention) {
        sessionStorage.setItem("PriceListTempSelectedTemp", this.selctedPriceListConvention);
        return this.param_service.GetDetailsPriceListByCodePriceListAndCodePrestationAnd(this.selctedPriceListConvention, codePrestation, codeNatAdmOPD)
          .pipe(
            map((dataDetailsCouverture: any) => ({
              ...medecin,
              // montantConsultation: dataDetailsCouverture.montantPEC
              montantConsultation: this.sumMontantFromDetails(dataDetailsCouverture)
            }))
          );

      } else {
        sessionStorage.setItem("PriceListTempSelectedTemp", priceListCashValue);
        return this.param_service.GetDetailsPriceListByCodePriceListAndCodePrestationAnd(priceListCashValue, medecin.medecinDTO.prestationConsultationDTO.codePrestation, codeNatAdmOPD)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('Error :', error);
              return throwError(() => new Error('Failed to Get Prestation.'));
            }),
            map((dataDetailsPL: any) => (

              {
                ...medecin,
                montantConsultation: this.sumMontantFromDetails(dataDetailsPL) || 0
              }

            ))
          );
      }
    });

    return Promise.all(priceRequests.map(obs => firstValueFrom(obs)));
  }


  GetAllModeReglement() {
    this.param_service.GetModeReglement().subscribe((data: any) => {
      this.dataModeRegelement = data;
      this.dataModeRegelementPushed = [];
      for (let i = 0; i < this.dataModeRegelement.length; i++) {
        this.dataModeRegelementPushed.push({ label: this.dataModeRegelement[i].codeSaisie + " || " + this.dataModeRegelement[i].designationAr, value: this.dataModeRegelement[i].code })
      }
      this.listModeReglementRslt = this.dataModeRegelementPushed;
    })
  }


  GetAllBanque() {
    this.param_service.GetBanque().subscribe((data: any[]) => {
      this.dataBanque = data;
      this.dataBanquePushed = [];
      for (let i = 0; i < this.dataBanque.length; i++) {
        this.dataBanquePushed.push({ label: this.dataBanque[i].codeSaisie + " || " + this.dataBanque[i].designationAr, value: this.dataBanque[i].code })
      }
      this.listBanqueRslt = this.dataBanquePushed;

      // this.dataBanquePushed = data.map(item => ({
      //   // label: item.designationAr,
      //   code: item.code,
      //   codeSaisie: item.codeSaisie,
      //   designationAr: item.designationAr,
      // }));
      // console.log('dataBanquePushed:', this.dataBanquePushed);
    })
  }


  L: any = "L";
  R: any = "R";

  GetPicLaboPaid() {
    return "url('assets/images/LaboPaid.png')";
  }

  GetPicLaboNotPaid() {
    return "url('assets/images/LaboNotPaid.png')";
  }
  

  getBackgroundImageLabo(examens: any[]): string {
    if (examens.length === 0) {
      return '';
    } 
    const hasLExamsPaid = examens.some(examen => examen.typeExamen === this.L && examen.codeEtatPaiement === 1); //Check for at least one paid.
    const hasLExamsNotPaid = examens.some(examen => examen.typeExamen === this.L && examen.codeEtatPaiement === 2);

    if (hasLExamsPaid && !hasLExamsNotPaid) { // If at least one is paid AND none are not paid
      return this.GetPicLaboPaid();
    } else if (hasLExamsNotPaid) { // If at least one is not paid (regardless of paid ones)
      return this.GetPicLaboNotPaid();
    } else {
      return ''; // No 'L' exams at all.
    }
  }



  
  GetPicRadioPaid() {
    return "url('assets/images/RadioPaid.png')";
  }

  GetPicRadioNotPaid() {
    return "url('assets/images/x-ray.png')";
  }
  

  getBackgroundImageRadio(examens: any[]): string {
    if (examens.length === 0) {
      return '';
    } 
    const hasLExamsPaid = examens.some(examen => examen.typeExamen === this.R && examen.codeEtatPaiement === 1); //Check for at least one paid.
    const hasLExamsNotPaid = examens.some(examen => examen.typeExamen === this.R && examen.codeEtatPaiement === 2);

    if (hasLExamsPaid && !hasLExamsNotPaid) { // If at least one is paid AND none are not paid
      return this.GetPicRadioPaid();
    } else if (hasLExamsNotPaid) { // If at least one is not paid (regardless of paid ones)
      return this.GetPicRadioNotPaid();
    } else {
      return ''; // No 'L' exams at all.
    }
  }




  
  GetPicPrestationPaid() {
    return "url('assets/images/RadioPaidx.png')";
  }

  GetPicPrestationNotPaid() {
    return "url('assets/images/RadioNotPaidx.png')";
  }
  

  getBackgroundImagePrestation(examens: any[]): string {
    if (examens.length === 0) {
      return '';
    } 
    const hasLExamsPaid = examens.some(examen => examen.typeExamen === 'X' && examen.codeEtatPaiement === 1); //Check for at least one paid.
    const hasLExamsNotPaid = examens.some(examen => examen.typeExamen === 'X' && examen.codeEtatPaiement === 2);

    if (hasLExamsPaid && !hasLExamsNotPaid) { // If at least one is paid AND none are not paid
      return this.GetPicRadioPaid();
    } else if (hasLExamsNotPaid) { // If at least one is not paid (regardless of paid ones)
      return this.GetPicRadioNotPaid();
    } else {
      return ''; // No 'L' exams at all.
    }
  }

  GetAllAdmission() {

    // let codeNatureAdmission = sessionStorage.getItem("NatureAdmissionOPD"); 
    //   this.recept_service.GetAdmissionByCodeNatureAdmission(codeNatureAdmission).subscribe((data: any) => {


    //   })

    this.recept_service.GetAdmissionForOPD().subscribe((data: any) => {

      this.dataAdmission = data;

      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
    })

  }

  nodeSelect(event: any) {
    sessionStorage.setItem("codeAdmissionSelectedOPD", JSON.stringify(event.data));

  }

  nodeUnselect(event: any) {
    sessionStorage.removeItem("codeAdmissionSelectedOPD");
  }

  colsParent!: any[];
  // colsParent: any[] = [
  //   { field: ' ', header: ' ' },
  //   { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie' , type:"text" },
  //   { field: 'patientDTO.nomCompltLt', header: 'Patient Name', type:"text"  }, //Directly access nested field

  //   { field: 'dateCreate' , header: 'Arrival Date' , type:"date"  },
  //   { field: 'cabinetDTO.designationAr', header: 'Cabinet' , type:"text"  },     //Directly access nested field
  //   { field: 'medecinDTO.nomIntervLt', header: 'Doctor' , type:"text"  },       //Directly access nested field
  // ];

  GetColumnsParent() {
    this.colsParent = [
      { field: ' ', header: ' ' },
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '20%', filter: "true", type: "text" },
      { field: 'patientDTO.nomCompltLt', header: this.i18nService.getString('NomLt') || 'NomLt', width: '20%', filter: "true", type: "text" },
      { field: 'dateCreate', header: this.i18nService.getString('DateArriver') || 'DateArriver', width: '20%', filter: "false", type: "date" },
      { field: 'cabinetDTO.designationAr', header: this.i18nService.getString('Cabinet') || 'Cabinet', width: '20%', filter: "false", type: "text" },

      { field: 'medecinDTO.nomIntervLt', header: this.i18nService.getString('NomMedecin') || 'NomMedecin', width: '20%', filter: "true", type: "text" },
      { field: ' ', header: this.i18nService.getString('Prestation') || 'Prestation', },
      { field: ' ', header: this.i18nService.getString('Laboratoire') || 'Laboratoire', },
      { field: ' ', header: this.i18nService.getString('Radiologie') || 'Radiologie', },


    ];
  }



  colsChild: Column[] = [
    { field: 'codeSaisie', header: 'Code Saisie' },
    { field: 'nomCompltLt', header: 'Name Latin ' },
    { field: 'nomCompltAr', header: 'Name  Arabic ' },
    { field: 'numTel', header: 'Phone Number' },
  ];
  password: any;
  CloseModalPassWord() {
    this.visbileModalPassword = false;
  }

  selectedNode!: any; //Make it any to accomodate various selected objects
  onRowExpand(event: TableRowExpandEvent) {
    // this.messageService.add({ severity: 'success', summary: 'Admission Expanded', detail: event.data.codeSaisie, life: 3000 });
  }

  expandedRows = {}; //Object to track expanded rows

  expandAll() {
    this.expandedRows = this.dataAdmission.reduce((acc, p) => (acc[p.code] = true) && acc, {}
    );
  }

  collapseAll() {
    this.expandedRows = {};
  }



  onRowCollapse(event: TableRowCollapseEvent) {
    // this.messageService.add({ severity: 'info', summary: 'Admission Collapsed', detail: event.data.codeSaisie, life: 3000 });
  }
  decryptedValue: string = '';
  OpenmodalPassword(mode: string) {
    this.visibleModal = false;
    this.visDelete = false;
    this.visibleModalPrint = false;
    this.visibleModalAddPatient = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'passwordModal') {




      button.setAttribute('data-target', '#ModalPassword');
      this.formHeader = this.i18nService.getString('Password');
      this.visibleModalRecherPatient = false;
      this.visibleModal = true;
      this.visibleModalAddPatient = false;
      this.visibleModalPrint = false;
      this.visbileModalPassword = true;

    }




  }

  getCodeSaisieAdmissionOPD() {
    this.param_service.GetCompteur("CodeSaisieADMOPD").
      subscribe((data: any) => {
        this.codeSaisie = data.prefixe + data.suffixe;
      })
  }

  DisabledReg() {
    if (this.RegDeferral === true) {
      this.RegDef = true;
    } else {
      this.RegDef = false;
      this.GetAllModeReglement();

    }
  }
}


