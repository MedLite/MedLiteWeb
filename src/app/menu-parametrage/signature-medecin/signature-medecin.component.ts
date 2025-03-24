import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, throwError } from 'rxjs';
import { ParametargeService } from '../ServiceClient/parametarge.service';

import * as alertifyjs from 'alertifyjs'
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { Dropdown } from 'primeng/dropdown';
import { Router } from '@angular/router';
declare const PDFObject: any;
@Component({
  selector: 'app-signature-medecin',
  templateUrl: './signature-medecin.component.html',
  styleUrls: ['./signature-medecin.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css']
})
export class SignatureMedecinComponent implements OnInit {



  cols!: any[];
  openModal!: boolean;
  IsLoading = true;
  ListMedecin = new Array<any>();
  selectedMedecin: any = '';
  @ViewChild('medecinInput') medecinInputElement!: Dropdown;
  constructor(private _sanitizer: DomSanitizer,
    private param_service: ParametargeService, private config: PrimeNGConfig, private messageService: MessageService,
    private CtrlAlertify: ControlServiceAlertify, public i18nService: I18nService, private router: Router) {


  }

  @Output() closed: EventEmitter<string> = new EventEmitter();
  closeThisComponent() {
    const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
    this.closed.emit(parentUrl);
    this.router.navigate([parentUrl]);
  }
  first = 0;
  pdfData!: Blob;
  isLoading = false;
  ngOnInit(): void {

    this.GelAllSignatureMedecin();

    this.GetColumns();



  }
  
  GetColumns() {
    this.cols = [ 
      { field: 'medecinDTO.codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '16%', filter: "true" },
      { field: 'medecinDTO.nomIntervAr', header: this.i18nService.getString('DesignationAr') || 'DesignationAr', width: '16%', filter: "true" },
      { field: 'medecinDTO.nomIntervLt', header: this.i18nService.getString('DesignationLt') || 'DesignationLt', width: '16%', filter: "true" },
 
       
    ];
  }

  // RemplirePrint(): void {

  //   this.param_achat_service.getPDFf().subscribe(blob => {
  //     const reader = new FileReader();
  //     const binaryString = reader.readAsDataURL(blob);
  //     reader.onload = (event: any) => {
  //       //Here you can do whatever you want with the base64 String
  //       // console.log("File in Base64: ", event.target.result);
  //       this.pdfData = event.target.result;
  //       this.isLoading = false;
  //       if (this.pdfData) {
  //         this.handleRenderPdf(this.pdfData);
  //       }
  //     };

  //     reader.onerror = (event: any) => {
  //       console.log("File could not be read: " + event.target.error.code);
  //     };
  //   });

  // }

  handleRenderPdf(data: any) {
  }


  clear(table: Table) {
    table.clear();
    this.searchTerm = '';
  }

  clearForm() {
    this.code == undefined;
    this.selectedMedecin = null;
    this.visibleModal = false; 
    this.selectedFile2 = new File([], "");
    this.onRowUnselect(event);

  }
  check_actif = false;
  check_inactif = false;

  formHeader = ".....";
  searchTerm = '';
  visibleModal: boolean = false;
  visibleModalPrint: boolean = false;
  visDelete: boolean = false;

  code!: number | null;
  signature!: any;

  selectedUser: any;

  onRowSelect(event: any) {
    this.code = event.data.code;
    this.selectedMedecin = event.data.codeMedecin;
    this.signature = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + event.data.signature);
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.code = event.data = null;
  }


  DeleteUser(code: any) {
    this.param_service.DeleteSignatureMedecin(code).pipe(
      catchError(() => {
        let errorMessage = '';

        return throwError(errorMessage);
      })

    ).subscribe(
      () => {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.ShowDeletedOK();
        this.ngOnInit();
        this.check_actif = true;
        this.check_inactif = false;

      }
    )
  }
  clearSelected(): void {
    this.code == undefined;
    this.signature = '';
    this.selectedMedecin = null;
  }

  dis: boolean = false;
  public onOpenModal(mode: string) {

    this.visibleModal = false;
    this.visDelete = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#Modal');
      this.formHeader = this.i18nService.getString('Add');
      this.onRowUnselect(event);
      this.clearSelected();
      this.GetMedecin();
      this.visibleModal = true;
      this.code == undefined;
      this.dis = false;

    }
    if (mode === 'edit') {


      if (this.code == undefined) {
        // alert("Choise A row Please");

        //  
        this.clearForm();
        this.onRowUnselect(event);
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showChoseAnyRowNotification(); 
        this.visDelete == false && this.visibleModal == false
      } else {

        button.setAttribute('data-target', '#Modal');
        this.formHeader = this.i18nService.getString('Modifier');
        this.GetMedecin();
        this.dis = true;
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


  }


  userCreate = sessionStorage.getItem("userName");
  fileReaderRst!: string;
  defaultSignature = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
  PostUser(event: any) {

    if (this.selectedMedecin == null) {

      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom("SelectAnyMedecin");
    } else {
      if (this.fileReaderRst == null) {
        this.fileReaderRst = this.defaultSignature
      } else {

      }

      let body = {
        codeMedecin: this.selectedMedecin,
        dateCreate: new Date().toISOString(), //
        code: this.code,
        sig: this.fileReaderRst,


      }
      // console.log("body to update", body);
      if (this.code != null) {
        body['code'] = this.code;

        this.param_service.UpdateSignatureMedecin(body).pipe(
          catchError(() => {
            let errorMessage = '';
            return throwError(errorMessage);
          })

        ).subscribe(

          () => {

            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowUpdatedOK();
            this.visibleModal = false;
            this.clearForm();
            this.ngOnInit();
            this.IsLoading = false;
            this.check_actif = true;
            this.check_inactif = false;
            this.onRowUnselect(event);
            this.clearSelected();

          }
        );


      }
      else {
        this.param_service.PostSignatureMedecin(body).pipe(
          catchError(() => {
            let errorMessage = '';

            return throwError(errorMessage);
          })
        ).subscribe(
          () => {

            this.CtrlAlertify.PostionLabelNotification();
            this.CtrlAlertify.ShowSavedOK();
            this.visibleModal = false;
            this.IsLoading = false;
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
    }


  }




  public remove(index: number): void {
    this.listDesig.splice(index, 1);
    console.log(index);
  }
  compteur: number = 0;
  listDesig = new Array<any>();
  files = [];

  totalSize : number = 0;

  totalSizePercent : number = 0;
  dataSignatureMedecin = new Array<any>();
  banque: any;
  GelAllSignatureMedecin() {
    this.param_service.GetAllSignatureMedecin().pipe(
      catchError(() => {
        let errorMessage = '';
        this.IsLoading = false;
        return throwError(errorMessage);
      })

    ).subscribe((data: any) => {

      this.IsLoading = false;


      this.dataSignatureMedecin = data;
      this.onRowUnselect(event);

    })
  }

  FileUploaded!: any;
  uploadedFiles: any[] = [];
  //   onUpload(event:any) {
  //     for(let file of event.files) {
  //         this.uploadedFiles.push(file);
  //         console.log("file base64", this.uploadedFiles)
  //     }
  //     console.log("file dddddddd", this.uploadedFiles)
  //     this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  // }
  fil64: any;
  click() {
    //  for(let file of event.files) {
    // this.uploadedFiles.push(this.getBase64(file));
    // console.log("file base6xxx4", this.uploadedFiles.name)

  }

  onUpload(event: any) {
    let fileReader = new FileReader();
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      fileReader.onload = function () {
        // Will print the base64 here.
        console.log(fileReader.result);
      };
    }
  }

  postmethodeSig(event: any) {
    let fileReader = new FileReader();
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      fileReader.onload = function () {
        // Will print the base64 here.
        console.log(fileReader.result);
      };
    }

  }
  // this.fil64 =  this.getBase64(this.FileUploaded );

  //   for(let file of event.files) {
  //     this.uploadedFiles.push(this.getBase64(file));
  //     console.log("file base6xxx4", this.uploadedFiles)
  // }
  // console.log("file basesssss64", this.uploadedFiles)
  // }


  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('file object is null');
      }

      var reader = new FileReader();

      reader.onloadend = function () {
        resolve({ res: reader.result, name: file.name });
      };
      reader.readAsDataURL(file);
    });
  }




  selectedFile2!: File;
  retrievedImage2: any;
  base64Data2: any;
  retrieveResonse2: any;
  message2!: string;
  imageName2: any;
  //Gets called when the user selects an image
  imagePreview!: string;
  public onFileChanged(event: any) {
    //Select File
    this.selectedFile2 = event.target.files[0];
    let file = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      const base64String = fileReader.result as string;
      console.log("base64String", base64String);
      this.fileReaderRst = base64String;
      console.log("fileReaderRst", this.fileReaderRst);

    }
    if (file) {
      fileReader.readAsDataURL(file);

    }


  }



  dataMedecin = new Array<any>();
  listMedecinPushed = new Array<any>();
  GetMedecin() {
    this.param_service.GetMedecinHaveSignature(false).subscribe((data: any) => {
      this.dataMedecin = data;
      this.listMedecinPushed = [];
      for (let i = 0; i < this.dataMedecin.length; i++) {
        this.listMedecinPushed.push({ label:  this.dataMedecin[i].nomIntervAr  + " || "  + this.dataMedecin[i].codeSaisie , value: this.dataMedecin[i].code })
      }
      this.ListMedecin = this.listMedecinPushed;
    }) 
    
  }

 

}


