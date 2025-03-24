import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService, TreeNode, } from 'primeng/api';
import { TreeTableNodeSelectEvent, TreeTableNodeUnSelectEvent } from 'primeng/treetable';
import { PatientSelectionService } from '../service/patientSelected/patient-selected.service';
import { Router } from '@angular/router';
import { ReceptionService } from '../../menu-reception/ServiceClient/reception.service';
import { SessionStorageService } from '../service/SessionStorageService';
import { DatePipe } from '@angular/common';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';

interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'app-list-admission-opd',
  templateUrl: './list-admission-opd.component.html',
  styleUrls: ['./list-admission-opd.component.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [MessageService]
})
export class ListAdmissionOPDComponent implements OnInit, AfterViewInit {
  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService, private recept_service: ReceptionService,
    private router: Router, private messageService: MessageService,
    private patientSelectionService: PatientSelectionService) { }

  files!: TreeNode[];
  cols!: Column[]; 

  AdmissionOPD!: any[];
  colsParent: Column[] = [
    { field: ' ', header: ' ' }, 
    { field: 'codeSaisie', header: 'Code Saisie' },
    { field: 'patientDTO.nomCompltLt', header: 'Patient Name' }, //Directly access nested field
    { field: 'patientDTO.codeSaisie', header: 'Patient ID' },    //Directly access nested field
    { field: 'dateCreate', header: 'Date Arrivée' },
    { field: 'cabinetDTO.designationAr', header: 'Cabinet' },     //Directly access nested field
    { field: 'medecinDTO.nomIntervLt', header: 'Medecin' },       //Directly access nested field
  ];

  colsChild: Column[] = [
    { field: 'codeSaisie', header: 'Code Saisie' },
    { field: 'nomCompltLt', header: 'Nom Complet (Latin)' },
    { field: 'nomCompltAr', header: 'Nom Complet (Arabic)' },
    { field: 'numTel', header: 'Phone Number' },
  ];


  selectedNode!: any; //Make it any to accomodate various selected objects
  expandedRows = {}; //Object to track expanded rows


  ngOnInit() {
    this.sessionStorageService.cleanupOnUnload();
    this.patientSelectionService.setSelectedCodeAdmission('');
    this.patientSelectionService.setSelectedPatientName('');
    this.patientSelectionService.setSelectedCodePatient('');
    sessionStorage.removeItem("codeAdmissionSelected");
    // this.fetchData();


    // this.cols = [
    //   { field: 'codeSaisie', header: 'Code Saisie' },
    //   { field: 'name', header: 'Name' },
    //   { field: 'codeSaisiePatient', header: 'Patient ID' },
    //   { field: 'dateCreate', header: 'Date Arrivée' },
    //   { field: 'cabinet', header: 'Cabinet' },
    //   { field: 'medecin', header: 'Medecin' },

    // ]; 
this.getAllAdmissionOPD();
    this.cdRef.detectChanges();
  }


  ngAfterViewInit() {
    this.sessionStorageService.clearSessionStorageIfNecessary(); //Call the clearing function
  }
  nodeSelect(event: any) {
    if (this.sessionStorageService.getItem("codeAdmissionSelected") != null) {


    } else {
      this.messageService.add({ severity: 'info', summary: 'Admission Selected', detail: event.data.codeSaisie });
    }


    this.patientSelectionService.setSelectedCodeAdmission(event.data.codeSaisie || 'codeSaisie');
    this.patientSelectionService.setSelectedPatientName(event.data.patientDTO.nomCompltLt || 'name');
    this.patientSelectionService.setSelectedCodePatient(event.data.patientDTO.codeSaisie || 'codeSaisiePatient');
    sessionStorage.setItem("codeAdmissionSelected", JSON.stringify(event.data));

  }

  nodeUnselect(event: any) {
    this.messageService.add({ severity: 'warn', summary: 'Admission Unselected', detail: event.data.codeSaisie });
    this.patientSelectionService.setSelectedCodeAdmission('');
    this.patientSelectionService.setSelectedPatientName('');
    this.patientSelectionService.setSelectedCodePatient('');
    sessionStorage.removeItem("codeAdmissionSelected");
  }

  // fetchData() {
  //   //Your API call or data retrieval from a service here
  //   //Example (replace with your actual API call)
  //   let codeNatureAdmission = sessionStorage.getItem("NatureAdmissionOPD");




  //   this.recept_service.GetAdmissionByCodeNatureAdmission(codeNatureAdmission).subscribe({
  //     next: (data: any[]) => {
  //       this.files = data.map(item => ({
  //         data: {
  //           code: item.code,
  //           codeSaisie: item.codeSaisie,
  //           name: item.patientDTO.nomCompltAr,  // Adjust to match your API response
  //           dateCreate: this.datePipe.transform(item.dateCreate, "yyyy-MM-dd"), // Adjust
  //           cabinet: item.cabinetDTO.designationAr,
  //           medecin: item.medecinDTO.nomIntervAr,
  //           codeSaisiePatient: item.patientDTO.codeSaisie,
  //           codePatient: item.patientDTO.code,

  //           // Adjust
  //         },
  //         children: [
  //           {
  //             data: {
  //               code: item.patientDTO.code,
  //               codeSaisie: item.patientDTO.codeSaisie,
  //               name: item.patientDTO.nomCompltAr,  // Adjust to match your API response
  //               dateNaissance: item.patientDTO.dateNaissance, // Adjust
  //               // Adjust
  //             },
  //           }

  //         ] // Or add children if needed
  //       }));
  //     },
  //     error: (error) => {
  //       console.error('Error fetching data:', error);
  //       //Handle error appropriately, e.g., display a message to the user.
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load patient data.' });
  //     }
  //   });
  // }

  // AdmissionOPD!: any[];
  getAllAdmissionOPD (){
    let codeNatureAdmission = sessionStorage.getItem("NatureAdmissionOPD");

    this.recept_service.GetAdmissionByCodeNatureAdmission(codeNatureAdmission).subscribe(  (data:any )=>{
this.AdmissionOPD = data;
    })
  } 
  expandAll() {
    this.expandedRows = this.AdmissionOPD.reduce((acc, p) => (acc[p.code] = true) && acc, {}
   );
  }

  collapseAll() {
    this.expandedRows = {};
  }
   onRowExpand(event: TableRowExpandEvent) {
    this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.codeSaisie, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.codeSaisie, life: 3000 });
  }

}