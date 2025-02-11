import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import * as alertifyjs from 'alertifyjs'
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
import { DayPilot } from "@daypilot/daypilot-lite-angular"; 
 
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
   
  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codePatientNewInputElement, this.codePatientNew);
    const nomAr = this.validationService.validateInputCommun(this.nomFullArNewInputElement, this.nomFullArNew);
    const nomLt = this.validationService.validateInputCommun(this.nomFullLtNewInputElement, this.nomFullLtNew);
    const tel = this.validationService.validateInputCommun(this.telPatientNewInputElement, this.TelPatientNew);
 

    return codeSaisie && nomAr && nomLt && tel ;
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
    this.validationService.validateInput(this.TelPatientInputElement, this.nomErrorElement, this.TelPatient, 'Tel');
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
  numPiece: any = "";
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
  MntCash: any = 0;
  MntPEC: any = 0;
  MntReqPayed: any = 0;
  MntPayed: any = 0;
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

  codePriceListCashFromData:any;
  codeNatureAdmissionOPDFromData:any;
 
 
  constructor( private CtrlAlertify: ControlServiceAlertify, private calandTrans: CalanderTransService,
    private datePipe: DatePipe, private validationService: InputValidationService,
    public i18nService: I18nService, private router: Router, private loadingComponent: LoadingComponent,
    private cdr: ChangeDetectorRef, private recept_service: ReceptionService, private param_service: ParametargeService) {
    this.calandTrans.setLangAR();
    

  }


 

  // blockDataToEvent(e: any): DayPilot.EventData {
  //   let date = new DayPilot.Date(e.date);
  //   return {
  //     id: e.id,
  //     start: date.addHours(e.block),
  //     end: date.addHours(e.block).addHours(e.duration),
  //     text: e.text,
  //     tags: e.tags
  //   };
  // }

  // eventToBlockData(data: DayPilot.EventData): any {
  //   let date = new DayPilot.Date(data.start).getDatePart();
  //   return {
  //     id: data.id,
  //     text: data.text,
  //     date: date,
  //     block: new DayPilot.Date(data.start).getHours(),
  //     duration: new DayPilot.Date(data.end).getHours() - new DayPilot.Date(data.start).getHours(),
  //     tags: data.tags
  //   };
  // }


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

    if (this.selectedValue == 2 && this.selectedConvention == 'NULL') {
      const fieldRequiredMessage = this.i18nService.getString('selctedAnyConvention');
      if (sessionStorage.getItem("lang") == "ar") {
        alertifyjs.notify(
          `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" 
          src="/assets/images/images/required.gif" alt="image" > `  + fieldRequiredMessage
        );
        alertifyjs.set('notifier', 'position', 'top-left');
      } else {
        alertifyjs.set('notifier', 'position', 'top-right');
        alertifyjs.notify(`<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" 
          src="/assets/images/images/required.gif" alt="image"  >` + fieldRequiredMessage
        );
      }
    } else {

      if (this.selectedValue == 1) {
        this.MntCash = event.data.montantConsultation;
        this.MntPEC = 0;
        this.MntReqPayed = event.data.montantConsultation;
        this.MntPayed = event.data.montantConsultation;
      } else {

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

    // this.ListPatientTried = [
    //   { code: '1', codePatient: 'U2400001', NomFullAr: 'سفيان 0', NomFullLt: 'soufien 0', TelPatient: '543283360', DateNais: '01/01/2021', codeConvention: '123', codeSociete: '1', codePriceList: 21 },
    //   { code: '2', codePatient: 'U2400002', NomFullAr: 'سفيان 1', NomFullLt: 'soufien 1', TelPatient: '543283361', DateNais: '01/01/2022', codeConvention: '145', codeSociete: '15', codePriceList: 23 },
    //   { code: '3', codePatient: 'U2400002', NomFullAr: 'سفيان 2', NomFullLt: 'soufien 2', TelPatient: '543283362', DateNais: '01/01/2023', codeConvention: '156', codeSociete: '9', codePriceList: 25 },
    //   { code: '4', codePatient: 'U2400003', NomFullAr: 'سفيان 3', NomFullLt: 'soufien 3', TelPatient: '543283363', DateNais: '01/01/2024', codeConvention: '453', codeSociete: '3', codePriceList: 27 },
    //   { code: '5', codePatient: 'U2400004', NomFullAr: 'سفيان 4', NomFullLt: 'soufien 4', TelPatient: '543283364', DateNais: '01/01/2025', codeConvention: '225', codeSociete: '5', codePriceList: 29 },
    //   { code: '6', codePatient: 'U2400005', NomFullAr: 'سفيان 5', NomFullLt: 'soufien 5', TelPatient: '543283365', DateNais: '01/01/2026', codeConvention: 'NULL', codeSociete: 'NULL', codePriceList: 200 },
    // ]
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

    // this.ListMedecinTried = [
    //   { code: '1', codeMedecin: 'Med0001', NomFullArMedecin: 'سفيان 0', NomFullLtMedecin: 'soufien 0', specialite_medecin: 'Geneco', Cabinet: 'Cab 2', montantConsultation: 120 },
    //   { code: '2', codeMedecin: 'Med0002', NomFullArMedecin: 'سفيان 1', NomFullLtMedecin: 'soufien 1', specialite_medecin: 'Radio', Cabinet: 'Cab 3', montantConsultation: 30 },
    //   { code: '3', codeMedecin: 'Med0003', NomFullArMedecin: 'سفيان 2', NomFullLtMedecin: 'soufien 2', specialite_medecin: 'Labo', Cabinet: 'Cab 45', montantConsultation: 40 },
    //   { code: '4', codeMedecin: 'Med0004', NomFullArMedecin: 'سفيان 3', NomFullLtMedecin: 'soufien 3', specialite_medecin: 'Femme', Cabinet: 'Cab 78', montantConsultation: 140 },
    //   { code: '5', codeMedecin: 'Med0005', NomFullArMedecin: 'سفيان 4', NomFullLtMedecin: 'soufien 4', specialite_medecin: 'Sureg', Cabinet: 'Cab 23', montantConsultation: 75 },
    //   { code: '6', codeMedecin: 'Med0006', NomFullArMedecin: 'سفيان 5', NomFullLtMedecin: 'soufien 5', specialite_medecin: 'Anthes', Cabinet: 'Cab 48', montantConsultation: 110 },
    //   { code: '7', codeMedecin: 'Med0007', NomFullArMedecin: 'سفيان 7', NomFullLtMedecin: 'soufien 7', specialite_medecin: 'Anthes', Cabinet: 'Cab 77', montantConsultation: 190 },
    //   { code: '45', codeMedecin: 'Med0045', NomFullArMedecin: 'سفيان45  ', NomFullLtMedecin: 'soufien 45', specialite_medecin: 'Anthes', Cabinet: 'Cab 45', montantConsultation: 640 },
    // ]
  }

  // @ViewChild('modal') modal!: any;

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];

  ngOnInit(): void {




    this.GetColumns();
    this.GetAllBanque();
    this.GetCodeNatureAdmissionOPD();

    this.listDeviseRslt = [
      { label: 'test', value: 'v1' },
      { label: 'test2', value: 'v2' },
    ]

    this.listModeReglementRslt = [
      { label: 'cash', value: '1' },
      { label: 'Cheque', value: '2' },
    ]
    this.listBanqueRslt = [
      { label: 'banque1', value: 1 },
      { label: 'banque2', value: 2 },
    ]
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


  GetColumns() {
    this.cols = [
      { field: 'TypeOP', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '5%', filter: "true" },
      { field: 'SourceDepenese', header: this.i18nService.getString('Designation') || 'Designation', width: '5%', filter: "true" },
      { field: 'codeEtatApprouver', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '5%', filter: "false" },
      { field: 'dateCreate', header: this.i18nService.getString('LabelActif') || 'Actif', width: '5%', filter: "true" },

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
    this.MntCash = '';
    this.MntPEC = '';
    this.MntPayed = '';
    this.MntReqPayed = '';
    this.dateNaissanceAdm = "";
    this.dateNaissanceNew = "";
    this.dateNaissanceRecherche = "";
    this.nomFullArNew = '';
    this.nomFullLtNew = '';
    this.TelPatientNew = '';
    this.selectedValueNew = 0;
    this.IDPatient = '';
    this.codePatientNew = '';

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
  rib!: string;
  actif!: boolean;
  visible!: boolean;
  dateNaissance!: Date;
  selectedBanque: any = "";


  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
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
    this.visibleModal = false;
    this.visDelete = false;
    this.visibleModalPrint = false;
    this.visibleModalAddPatient = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
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
        this.visibleModalRecherPatient = false;
        this.visibleModal = true;
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
  // datecreate !: Date;
  // currentDate = new Date();

  // ajusterHourAndMinutes() {
  //   let hour = new Date().getHours();
  //   let hours;
  //   if (hour < 10) {
  //     hours = '0' + hour;
  //   } else {
  //     hours = hour;
  //   }
  //   let min = new Date().getMinutes();
  //   let mins;
  //   if (min < 10) {
  //     mins = '0' + min;
  //   } else {
  //     mins = min;
  //   }
  //   return hours + ':' + mins
  // }
  // datform = new Date();






  PostBanque() {

    // if (this.numPiece == "" && this.selectedModeReglement == "2") {
    //   // this.validateNumPieceInput();

    // } else {

    // }


    this.validateModeReglementInput();
    this.validateBanqueInput();
    this.validateNumPieceInput();
    this.validateCodeInput(); // Validate the input before posting
    this.validateNomArInput();
    this.validateNomLtInput();
    this.validateTelPatientInput()
    this.validateSpecialiteMedecinInput();


    let body = {
      codeSaisie: this.codeSaisie,
      designationAr: this.designationAr,
      designationLt: this.designationLt,
      userCreate: this.userCreate,
      rib: this.rib,

      dateCreate: new Date().toISOString(), //
      code: this.code,
      actif: this.actif,
      visible: this.visible,

    }
    if (this.code != null) {
      body['code'] = this.code;

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
      // this.param_service.PostBanque(body) .subscribe(
      //   (res:any) => {
      //     alertifyjs.set('notifier', 'position', 'top-left'); 
      //     alertifyjs.notify('<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/files/images/ok.png" alt="image" >' + "تم الحفظ بنجاح");
      //     this.visibleModal = false;
      //     this.clearForm();
      //     this.ngOnInit();
      //     this.code;
      //     this.check_actif = true;
      //     this.check_inactif = false;
      //     this.onRowUnselect(event);
      //     this.clearSelected();

      //   }
      // )
    }
    // }

    // }
  }


  Voids(): void {
    // this.cars = [

    // ].sort((car1, car2) => {
    //   return 0;
    // });

  }



  public remove(index: number): void {
    this.listDesig.splice(index, 1);
    console.log(index);
  }






  compteur: number = 0;
  listDesig = new Array<any>();

  // cars!: Array<Matiere>;
  // brands!: SelectItem[];
  // clonedCars: { [s: string]: Matiere } = {}; 
  dataBanque = new Array<any>();
  GetAllBanque() {
    // this.param_service.GetBanque().subscribe((data: any) => {

    this.loadingComponent.IsLoading = false;
    this.IsLoading = false;

    //   this.dataBanque = data;
    //   this.onRowUnselect(event);

    // }) 
  }




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

    if (this.selectedModeReglement == '1') {
      this.DisBanque = true;
      this.selectedBanque = null;
      this.numPiece = '';

    } else {
      this.DisBanque = false;
      this.DisCaisse = true
      // this.selectedCaisse = null;
    }

    // this.paramService.GetModeReglementByCode(this.selectedModeReglement).subscribe((data: any) => {
    //   if (data.reqBanque == true) {
    //     this.GetBanque();
    //     this.DisBanque = false;
    //     this.DisCaisse = true
    //     this.selectedCaisse = null;
    //   } else {
    //     this.DisBanque = true;
    //     this.selectedBanque = null;
    //     this.numPiece = '';
    //     this.DisCaisse = false
    //     this.GetCaisse();
    //   }
    // })


  }
  VisiblePEC: boolean = false;
  GetIfNeedSocForAddAdmission() {
    if (this.selectedValue == 1) {
      this.VisiblePEC = false;
      this.SelectedMedecinFromList = '';

    } else {
      this.SelectedMedecinFromList = '';
      this.MntCash = 0;
      this.MntPEC = 0;
      this.MntPayed = 0;
      this.MntReqPayed = 0;
      this.VisiblePEC = true;
    }
  }

  GetCodePriceListFromConventionSelected(codeConvention:number){
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
      this.SelectedMedecinFromList = '';
      this.codePriceList = 1;

    } else {
      this.SelectedMedecinFromList = '';
      this.MntCash = 0;
      this.MntPEC = 0;
      this.MntPayed = 0;
      this.MntReqPayed = 0;
     
      this.GetSociete();
      this.VisiblePEC = true;
    }
  }

  GetDetailsConventionSelected() {

  }

  GetConventionByCodeSocieteSelected(selectedSocieteCode: number) {
    this.selectedConvention = '';
    // this.GetCodePriceListFromConventionSelected(this.selectedValueNew);
  }

  dataConvention:any
  listConventionPushed:any;
  GetListConventionFromSociete(codeSociet : number){
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
    this.MntCash = '';
    this.MntPEC = '';
    this.MntPayed = '';
    this.MntReqPayed = '';
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

  SourceDeFinancement = 'SourceDeFinancement';
  DateNaiss = 'DateNaiss';
  codePriceListTemp = "NULL";
  PostNewPatient() {
    const isValid = this.validateAllInputs();

    if (this.dateNaissanceNew == "") {
      this.validationService.showRequiredNotificationWithParam(this.DateNaiss);
    }else

    if (this.selectedValueNew == 0) {
      this.validationService.showRequiredNotificationWithParam(this.SourceDeFinancement);
    } else { 
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
          dateNaissance:this.dateNaissanceNew,
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

  DateTempNew: any;
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

  DateTempRecherche: any;
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

  
  dataSociete = new Array<any>();
  listSocietePushed = new Array<any>();
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
 

  GetCompteurPatient(){
    this.param_service.GetCompteur("CompteurPatient").subscribe((data: any) => { 
      this.codePatientNew = data.prefixe + data.suffixe; 
    }) 
  }

  GetCodePriceListCash(){
    this.param_service.GetParam("PriceListCash").subscribe((data: any) => { 
      this.codePriceListCashFromData = data.valeur ; 
    }) 
  }

  GetCodeNatureAdmissionOPD(){
    this.param_service.GetParam("CodeNatureAdmissionOPD").subscribe((data: any) => { 
      this.codeNatureAdmissionOPDFromData = data.valeur ; 
    }) 
  }


  GetAllMedecinContientConsultation(){
this.param_service.GetMedecinActifAndHaveConsultation().subscribe((data:any) => {

  this.ListMedecinTried = data
  
})

  }
}


