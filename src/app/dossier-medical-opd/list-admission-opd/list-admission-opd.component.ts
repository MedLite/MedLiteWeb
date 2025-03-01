import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService, TreeNode, } from 'primeng/api';
import { TreeTableNodeSelectEvent, TreeTableNodeUnSelectEvent } from 'primeng/treetable';
import { PatientSelectionService } from '../service/patientSelected/patient-selected.service';
import { Router } from '@angular/router';
import { ReceptionService } from '../../menu-reception/ServiceClient/reception.service';
import { SessionStorageService } from '../service/SessionStorageService';

interface Column {
  field: string;
  header: string;
}


@Component({
  selector: 'app-list-admission-opd',
  templateUrl: './list-admission-opd.component.html',
  styleUrl: './list-admission-opd.component.css',
  providers: [MessageService]
})
export class ListAdmissionOPDComponent implements OnInit, AfterViewInit {
  constructor(  private cdRef: ChangeDetectorRef ,private sessionStorageService: SessionStorageService, private recept_service: ReceptionService, private router: Router, private messageService: MessageService, private patientSelectionService: PatientSelectionService) { }

  files!: TreeNode[];
  cols!: Column[];
  selectedNode!: TreeNode;

  ngOnInit() { 
    this.sessionStorageService.cleanupOnUnload(); 
    this.patientSelectionService.setSelectedPatientCode('');
    this.patientSelectionService.setSelectedPatientName('');
    sessionStorage.removeItem("codeAdmissionSelected");
    this.fetchData();


    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'codeSaisie', header: 'Code Saisie' }
    ];
    this.cdRef.detectChanges(); 
  }

  ngAfterViewInit() {
    this.sessionStorageService.clearSessionStorageIfNecessary(); //Call the clearing function
  } 
  nodeSelect(event: TreeTableNodeSelectEvent) {
    if (this.sessionStorageService.getItem("codeAdmissionSelected") != null) {


    } else {
      this.messageService.add({ severity: 'info', summary: 'Node Selected', detail: event.node?.data.codeSaisie });
    }


    this.patientSelectionService.setSelectedPatientCode(event.node?.data.codeSaisie || '');
    this.patientSelectionService.setSelectedPatientName(event.node?.data.name || 'xx');
    sessionStorage.setItem("codeAdmissionSelected", JSON.stringify(event.node?.data));
  }

  nodeUnselect(event: TreeTableNodeUnSelectEvent) {
    this.messageService.add({ severity: 'warn', summary: 'Node Unselected', detail: event.node?.data.codeSaisie });
    this.patientSelectionService.setSelectedPatientCode('');
    this.patientSelectionService.setSelectedPatientName('');
    sessionStorage.removeItem("codeAdmissionSelected");
  }

  fetchData() {
    //Your API call or data retrieval from a service here
    //Example (replace with your actual API call)
    this.recept_service.GetPatient().subscribe({
      next: (data: any[]) => {
        this.files = data.map(item => ({
          data: {
            code: item.code,
            name: item.nomCompltAr,  // Adjust to match your API response
            size: item.dateNaissance, // Adjust
            codeSaisie: item.codeSaisie, // Adjust
          },
          children: [
            {
              data: {
                code: item.code,
                name: item.nomCompltAr,  // Adjust to match your API response
                size: item.dateNaissance, // Adjust
                codeSaisie: item.codeSaisie, // Adjust
              },
            }

          ] // Or add children if needed
        }));
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        //Handle error appropriately, e.g., display a message to the user.
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load patient data.' });
      }
    });
  }


}