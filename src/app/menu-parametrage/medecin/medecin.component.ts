import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { InputValidationService } from '../../Shared/Control/ControlFieldInput';
import { Dropdown } from 'primeng/dropdown';
import { ParametargeService } from '../ServiceClient/parametarge.service';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

declare const PDFObject: any;



@Component({
  selector: 'app-medecin',
  templateUrl: './medecin.component.html',
  styleUrls: ['./medecin.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'], providers: [ConfirmationService, MessageService]
})
export class MedecinComponent implements OnInit {

  @ViewChild('codeError') codeErrorElement!: ElementRef;
  @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
  @ViewChild('designationArInput') desginationArInputElement!: ElementRef;
  @ViewChild('designationLtInput') designationLtInputElement!: ElementRef;
  @ViewChild('specialiteMedecinInput') specialiteMedecinInputElement!: Dropdown;
  @ViewChild('typeIntervenatInput') typeIntervenantInputElement!: Dropdown;

  first = 0;
  IsLoading = true;
  openModal!: boolean;

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  LabelConsultationOPD = "";
  LabelConsultationER = "";
  constructor(private cdRef: ChangeDetectorRef, public param_service: ParametargeService, public i18nService: I18nService,
    private router: Router, private loadingComponent: LoadingComponent,
    private validationService: InputValidationService, private CtrlAlertify: ControlServiceAlertify) {
  }


  // itemsNatureAdmission: MenuItem[] | undefined;
  // activeItemNatureAdmission: MenuItem | undefined;

  @ViewChild('modal') modal!: any;

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];
  formHeader = ".....";
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  VisbileModalSignature: boolean = false;
  visDelete: boolean = false;
  code!: number | null;
  codeSaisie: any;
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  actif!: boolean;
  visible!: boolean;
  LabelActif!: string;
  userCreate = sessionStorage.getItem("userName");
  dataMedecin = new Array<any>();
  selectedMedecin!: any;
  ListspecialiteMedecin = new Array<any>();
  selectedspecialiteMedecin: any = '';

  ListTypeIntervenant = new Array<any>();
  selectedTypeIntervenant: any = '';

  ListPrestationOPD = new Array<any>();
  ListPrestationER = new Array<any>();
  SelectedPrestationOPD: any = '';
  SelectedPrestationER: any = '';

  autoriseFrais!: boolean;
  LabelautoriseFrais !: string;

  autoriseCons!: boolean;
  LabelautoriseCons !: string;

  VisibleAutoriseConsultation: boolean = false;


  medecinOPD: boolean = false;
  medecinER: boolean = false;
  ngOnInit(): void {
    this.items = [
      { label: this.i18nService.getString('LabelActif') || 'LabelActif', icon: 'pi pi-file-check', command: () => { this.GetAllMedecinActif() } },
      { label: this.i18nService.getString('LabelInActif') || 'LabelInActif', icon: 'pi pi-file-excel', command: () => { this.GetAllMedecinInactif() } },
      { label: this.i18nService.getString('LabelAll') || 'LabelAll', icon: 'pi pi-file', command: () => { this.GetAllMedecin() } },
    ];
    this.activeItem = this.items[0];

    this.GetColumns();
    this.GetAllMedecinActif();
  }



  // GetCodeNatureAdmissionOPD() {
  //   this.param_service.GetParam("CodeNatureAdmissionOPD").
  //     subscribe((data: any) => {
  //       this.codeNatureAdmissionOPD = data.valeur;
  //     })
  // }

  // GetCodeNatureAdmissionER() {
  //   this.param_service.GetParam("CodeNatureAdmissionER").
  //     subscribe((data: any) => {
  //       this.codeNatureAdmissionER = data.valeur;
  //     })
  // }
  GetColumns() {
    this.cols = [
      { field: 'specialiteMedecinDTO.designationAr', header: this.i18nService.getString('SpecialiteMedecin') || 'SpecialiteMedecin', width: '20%', filter: "true" },

      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'nomIntervAr', header: this.i18nService.getString('Designation') || 'Designation', width: '16%', filter: "true" },
      { field: 'nomIntervLt', header: this.i18nService.getString('DesignationSecondaire') || 'DesignationSecondaire', width: '16%', filter: "false" },
      { field: 'typeIntervenantDTO.designationAr', header: this.i18nService.getString('TypeIntervenant') || 'TypeIntervenant', width: '16%', filter: "false" },
      { field: 'autoriseFrais', header: this.i18nService.getString('LabelautoriseFrais') || 'LabelautoriseFrais', width: '16%', filter: "true" },

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

  CloseModalSignature() {
    this.VisbileModalSignature = false;
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
    this.selectedMedecin = ''
    this.selectedspecialiteMedecin = '';
    this.selectedTypeIntervenant = '';
    this.VisibleAutoriseConsultation = false;
    this.autoriseFrais = false;
    this.autoriseCons = false;
    this.SelectedPrestationER = '';
    this.SelectedPrestationOPD = ''
    this.prestationMedecinConsultationDTO = new Array<any>();
    this.onRowUnselect(event);
    this.VisbileModalSignature=false;

  }


  GetCodeSaisie() {
    this.param_service.GetCompteur("CodeSaisieMedecin").
      subscribe((data: any) => {
        this.codeSaisie = data.prefixe + data.suffixe;
      })
  }


  onRowSelect(event: any) {
    this.code = event.data.code;
    this.actif = event.data.actif;
    this.visible = event.data.visible;
    this.codeSaisie = event.data.codeSaisie;
    this.designationAr = event.data.nomIntervAr;
    this.designationLt = event.data.nomIntervLt;
    this.selectedspecialiteMedecin = event.data.specialiteMedecinDTO.code
    this.selectedTypeIntervenant = event.data.typeIntervenantDTO.code

    this.autoriseFrais = event.data.autoriseFrais;

    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteMedecin(code: any) {
    this.param_service.DeleteMedecin(code).subscribe(
      (res: any) => {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit();
        this.visDelete = false;

      }
    )
  }


  public onOpenModal(mode: string) {
    const natureAdmEr = sessionStorage.getItem("NatureAdmissionER") ;
      const codeNatAdmER = Number(natureAdmEr);
      const natureAdmOPD = sessionStorage.getItem("NatureAdmissionOPD") ;
      const codeNatAdmOPD = Number(natureAdmOPD);


    this.LabelActif = this.i18nService.getString('LabelActif');

    this.LabelautoriseFrais = this.i18nService.getString('LabelautoriseFrais');
    this.LabelautoriseCons = this.i18nService.getString('LabelautoriseCons');
    this.visibleModal = false;
    this.visDelete = false;
    this.visibleModalPrint = false;
    this.VisbileModalSignature = false;
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
      this.GetSpecilaiteSpecialiteMedecin();
      this.GetTypeIntervenat();

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

        this.GetPrestationByTypePrestationConsultationOPD();
        this.GetPrestationByTypePrestationConsultationER();
        if (this.selectedMedecin.autorisConsultation == true) {


          this.param_service.GetPrestationConsultationByCodeMedecin(this.selectedMedecin.code).subscribe(
            (res: any) => {


              if (res != null) {

                this.LabelConsultationER = this.i18nService.getString('LabelConsultationER');
                this.LabelConsultationOPD = this.i18nService.getString('LabelConsultationOPD');
                this.autoriseCons = true;
                this.VisibleAutoriseConsultation = true;
                if (res.codeNatureAdmission == codeNatAdmOPD) {
                  this.SelectedPrestationOPD = res.codePrestation;
                }

                if (res.codeNatureAdmission == codeNatAdmER) {
                  this.SelectedPrestationER = res.codePrestation
                }

              } else {
                this.autoriseCons = false;
                this.VisibleAutoriseConsultation = false;
              }


            }
          )

        }






        this.GetSpecilaiteSpecialiteMedecin();
        this.GetTypeIntervenat();

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

    // if (mode === 'Signature') {
    //   if (this.code == undefined) {
    //     this.onRowUnselect;
    //     this.CtrlAlertify.PostionLabelNotification();
    //     this.CtrlAlertify.showChoseAnyRowNotification();
    //     this.visDelete == false && this.visibleModal == false && this.visibleModalPrint == false && this.VisbileModalSignature == false
    //   } else {
    //     button.setAttribute('data-target', '#ModalSignature');
    //     this.formHeader = "Signature Medecin "
    //     this.VisbileModalSignature = true; 

    //   } 
    // }
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = this.i18nService.getString('Add');
      this.onRowUnselect(event);

      this.clearForm();
      this.GetCodeSaisie();
      this.GetSpecilaiteSpecialiteMedecin();
      this.GetTypeIntervenat();

      this.actif = false;
      this.visible = false;
      this.visibleModal = true;
      this.code == undefined;


    }

  }



  private validateAllInputs(): boolean { // Returns true if all valid, false otherwise
    const codeSaisie = this.validationService.validateInputCommun(this.codeSaisieInputElement, this.codeSaisie);
    const designationAr = this.validationService.validateInputCommun(this.desginationArInputElement, this.designationAr);
    const designationLt = this.validationService.validateInputCommun(this.designationLtInputElement, this.designationLt);
    const spec_Cab = this.validationService.validateDropDownCommun(this.specialiteMedecinInputElement, this.selectedspecialiteMedecin);

    const TypeInterv = this.validationService.validateDropDownCommun(this.typeIntervenantInputElement, this.selectedTypeIntervenant);

    return codeSaisie && designationAr && designationLt && spec_Cab && TypeInterv;
  }


  prestationMedecinConsultationDTO = new Array<any>();
  PostMedecin() {



    const isValid = this.validateAllInputs();
    if (isValid) {

      const natureAdmEr = sessionStorage.getItem("NatureAdmissionER") ;
      const codeNatAdmER = Number(natureAdmEr);
      const natureAdmOPD = sessionStorage.getItem("NatureAdmissionOPD") ;
      const codeNatAdmOPD = Number(natureAdmOPD);


      if (this.autoriseCons == true) {
        if (this.SelectedPrestationOPD != null || this.SelectedPrestationOPD !== "") {
          let bodyTOPrestationOPD = {
            codePrestation: this.SelectedPrestationOPD,
            codeNatureAdmission: codeNatAdmOPD
          }
          this.prestationMedecinConsultationDTO.push(bodyTOPrestationOPD);
        }

        if (this.SelectedPrestationER != null || this.SelectedPrestationER !== "") {
          let bodyTOPrestationER = {
            codePrestation: this.SelectedPrestationER,
            codeNatureAdmission: codeNatAdmER
          }
          this.prestationMedecinConsultationDTO.push(bodyTOPrestationER);
        }


        if (this.SelectedPrestationER == null || this.SelectedPrestationER === "") {
          this.medecinOPD = true;
          this.medecinER = false;
          this.prestationMedecinConsultationDTO = this.prestationMedecinConsultationDTO.filter(item => item.codePrestation !== this.SelectedPrestationER); //remove if null or empty
        }

        if (this.SelectedPrestationOPD == null || this.SelectedPrestationOPD === "") {
          this.medecinOPD = false;
          this.medecinER = true;
          this.prestationMedecinConsultationDTO = this.prestationMedecinConsultationDTO.filter(item => item.codePrestation !== this.SelectedPrestationOPD); //remove if null or empty
        }

      }


      let body = {
        codeSaisie: this.codeSaisie,
        nomIntervAr: this.designationAr,
        nomIntervLt: this.designationLt,
        userCreate: this.userCreate,
        codeSpecialiteMedecin: this.selectedspecialiteMedecin,
        codeTypeIntervenant: this.selectedTypeIntervenant,
        autorisConsultation: this.autoriseCons,
        autoriseFrais: this.autoriseFrais,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        actif: this.actif,
        prestationMedecinConsultationDTOs: this.prestationMedecinConsultationDTO,
        opd: this.medecinOPD,
        er: this.medecinER,

      }


      if (this.code != null) {
        body['code'] = this.code;

        this.param_service.UpdateMedecin(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            this.prestationMedecinConsultationDTO = new Array<any>();
            return throwError(errorMessage);

          })
        ).subscribe(

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
        this.param_service.PostMedecin(body).pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            this.prestationMedecinConsultationDTO = new Array<any>();
            return throwError(errorMessage);

          })
        ).subscribe(
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











  GetAllMedecin() {
    this.IsLoading = true;
    this.param_service.GetMedecin().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataMedecin = data;
      this.onRowUnselect(event);

    })
  }
  GetAllMedecinActif() {
    this.IsLoading = true;
    this.param_service.GetMedecinActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataMedecin = data;
      this.onRowUnselect(event);

    })
  }
  GetAllMedecinInactif() {
    this.IsLoading = true;
    this.param_service.GetMedecinInActif().subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataMedecin = data;
      this.onRowUnselect(event);

    })
  }


  CloseModal() {
    this.visDelete = false;
  }


  dataspecialiteMedecin = new Array<any>();
  listSpecialiteMedecinPushed = new Array<any>();
  GetSpecilaiteSpecialiteMedecin() {
    this.param_service.GetSpecialiteMedecin().subscribe((data: any) => {
      this.dataspecialiteMedecin = data;
      this.listSpecialiteMedecinPushed = [];
      for (let i = 0; i < this.dataspecialiteMedecin.length; i++) {
        this.listSpecialiteMedecinPushed.push({ label: this.dataspecialiteMedecin[i].designationAr, value: this.dataspecialiteMedecin[i].code })
      }
      this.ListspecialiteMedecin = this.listSpecialiteMedecinPushed;
    })
  }



  dataTypeIntervenant = new Array<any>();
  listTypeIntervenantPushed = new Array<any>();
  GetTypeIntervenat() {
    this.param_service.GetTypeIntervenantActifAndVirtuel(true).subscribe((data: any) => {
      this.dataTypeIntervenant = data;
      this.listTypeIntervenantPushed = [];
      for (let i = 0; i < this.dataTypeIntervenant.length; i++) {
        this.listTypeIntervenantPushed.push({ label: this.dataTypeIntervenant[i].designationAr, value: this.dataTypeIntervenant[i].code })
      }
      this.ListTypeIntervenant = this.listTypeIntervenantPushed;
    })
  }


  dataPrestationOPD = new Array<any>();
  listPrestationPushedOPD = new Array<any>();
  GetPrestationByTypePrestationConsultationOPD() {

    const natureAdmOPD = sessionStorage.getItem("NatureAdmissionOPD") ;
    const codeNatAdm = Number(natureAdmOPD);
        this.param_service.GetPrestationConsultation(codeNatAdm).subscribe((dataOPD: any) => {
          this.dataPrestationOPD = dataOPD;
          this.listPrestationPushedOPD = [];
          for (let i = 0; i < this.dataPrestationOPD.length; i++) {
            this.listPrestationPushedOPD.push({ label: this.dataPrestationOPD[i].designationAr, value: this.dataPrestationOPD[i].code })
          }
          this.ListPrestationOPD = this.listPrestationPushedOPD;
        })
   


  }


  dataPrestationER = new Array<any>();
  listPrestationPushedER = new Array<any>();
  GetPrestationByTypePrestationConsultationER() { 
    const natureAdmEr = sessionStorage.getItem("NatureAdmissionER") ;
    const codeNatAdm = Number(natureAdmEr);
        this.param_service.GetPrestationConsultation(codeNatAdm).subscribe((dataER: any) => {
          this.dataPrestationER = dataER;
          this.listPrestationPushedER = [];
          for (let i = 0; i < this.dataPrestationER.length; i++) {
            this.listPrestationPushedER.push({ label: this.dataPrestationER[i].designationAr, value: this.dataPrestationER[i].code })
          }
          this.ListPrestationER = this.listPrestationPushedER;
        })
    



  }



  // GetAllNatureAdmission() {
  //   this.VisibleAutoriseConsultation = true;


  // }



  GetAllNatureAdmission(event: any) {

    this.VisibleAutoriseConsultation = event.checked;
    this.LabelConsultationER = this.i18nService.getString('LabelConsultationER');
    this.LabelConsultationOPD = this.i18nService.getString('LabelConsultationOPD');
    this.GetPrestationByTypePrestationConsultationOPD();
    this.GetPrestationByTypePrestationConsultationER();


    this.cdRef.detectChanges();
  }






}







