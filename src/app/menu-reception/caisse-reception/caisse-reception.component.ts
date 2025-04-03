import { Component, ChangeDetectorRef, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
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
interface YourDataType { 
  id: number;
  name: string; 
}
declare const PDFObject: any;
@Component({
  selector: 'app-caisse-reception',
  templateUrl: './caisse-reception.component.html',
  styleUrls: ['./caisse-reception.component.css', '.../../../src/assets/css/StyleGroupBtnAndTable.css',
    '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [ConfirmationService, MessageService, InputValidationService, CalanderTransService, ControlServiceAlertify]
})
export class CaisseReceptionComponent implements OnInit {



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

 


  IsLoading = true;
  openModal!: boolean;     
  visibleModal: boolean = false;
  visibleModalAddPatient: boolean = false;
  visibleModalRecherPatient: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;
  dataAdmission = new Array<any>();
  code:any;

  pdfData!: Blob;
  isLoading = false;
  cols!: any[];
  formHeader = ".....";
  searchTerm = '';
  designationAr: string = 'NULL';
  designationLt: string = "NULL";
  selectedAdmission : any;
   
  constructor(private encryptionService: EncryptionService, private CtrlAlertify: ControlServiceAlertify, private calandTrans: CalanderTransService,
    private datePipe: DatePipe, private validationService: InputValidationService,
    public i18nService: I18nService, private router: Router, private loadingComponent: LoadingComponent,
    private cdr: ChangeDetectorRef, private recept_service: ReceptionService, private param_service: ParametargeService) {
     


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

 
  ngOnInit(): void {


    sessionStorage.removeItem("CodePatientTemp");
    sessionStorage.removeItem("ListCouvertureTemp");
    sessionStorage.removeItem("PriceListTempSelectedTemp");
    sessionStorage.removeItem("CodePatientTemp");
    this.GetAllAdmission();
    this.GetColumns();
   

  

  }



 


  GetColumns() {
    this.cols = [
      { field: 'TypeOP', header: this.i18nService.getString('') || '', width: '5%', filter: "true" , type:"text"  },
      { field: 'TypeOP', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '5%', filter: "true" ,type :"text" },
      { field: 'SourceDepenese', header: this.i18nService.getString('NomFullAr') || 'NomFullAr', width: '5%', filter: "true"  ,type :"text"  },
      { field: 'codeEtatApprouver', header: this.i18nService.getString('NomMedecin') || 'NomMedecin', width: '5%', filter: "false"  ,type :"text"  },
      { field: 'codeEtatApprouver', header: this.i18nService.getString('DateArriver') || 'DateArriver', width: '5%', filter: "false"  ,type :"date" },
      { field: 'dateCreate', header: this.i18nService.getString('Laboratoire') || 'Laboratoire', width: '5%', filter: "true"  ,type :"text"  },
      { field: 'dateCreate', header: this.i18nService.getString('Radiologie') || 'Radiologie', width: '5%', filter: "true" ,type :"text"  },
      { field: 'dateCreate', header: this.i18nService.getString('Prestation') || 'Prestation', width: '5%', filter: "true"  ,type :"text"  },

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
    this.visibleModal = false;
     
    this.onRowUnselect(event);

  }
 




  onRowSelect(event: any) {
    this.code = event.data.code; 
    this.designationAr = event.data.designationAr;
    this.designationLt = event.data.designationLt; 
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }



  DeleteBanque(code: any) {
    
  }
   
  
  public OpenModal(mode: string) {

  
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
 
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = this.i18nService.getString('Add');
      this.onRowUnselect(event);
    
      this.code == undefined;


    }  

  }

    


  userCreate = sessionStorage.getItem("userName");


 

 
  PostAdmission() {

     
  }


 GetAllAdmission(){
  this.loadingComponent.IsLoading = false;
  this.IsLoading = false;

 }


 




  


  
}


