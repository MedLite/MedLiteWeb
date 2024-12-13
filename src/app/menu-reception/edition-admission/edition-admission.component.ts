import { Component } from '@angular/core';
 
import { DatePipe } from '@angular/common'; 
import * as alertifyjs from 'alertifyjs'
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimeNGConfig } from 'primeng/api';
import { I18nService } from '../../Shared/i18n/i18n.service';
declare const PDFObject: any;
@Component({
  selector: 'app-edition-admission',
  templateUrl: './edition-admission.component.html',
  styleUrls:[ './edition-admission.component.css', '.../../../src/assets/css/StyleApplication.css']
})
export class EditionAdmissionComponent {

  modalContent: string = '';
  showModalFactureFrsPaied: boolean = false;
  showModalFactureFrsNotPaied: boolean = false;

  constructor(public i18nService: I18nService,public primengConfig: PrimeNGConfig , private datePipe: DatePipe) {
    this.setLangAR();
  }
  // isHighlighted1 = false;
  // toggleHighlight1() {
  //   this.isHighlighted1 = !this.isHighlighted1;
  // }
  // isHighlighted2 = false;
  // toggleHighlight2() {
  //   this.isHighlighted2= !this.isHighlighted2;
  // }


  highlightedIndex: number | null = null; 
  toggleHighlight(index: number) {
    this.highlightedIndex = (this.highlightedIndex === index) ? null : index;  // Toggle or set
  }

  ngOnInit(): void {
  }


  setLangAR() {
    this.primengConfig.setTranslation(this.ar);
  }
  ar = {
    firstDayOfWeek: 6, // Sunday (Adjust based on your region's convention)
    dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesMin: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    today: 'اليوم',
    clear: 'مسح',
    apply: 'بحث',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'أسبوع'
  };
  openModalFactureFrsPaied() { 
    this.dateDebut = "";
    this.dateFin = "";
    this.closeModalFactureFrsNotPaied();

    if(this.showModalFactureFrsPaied == true){
      this.showModalFactureFrsPaied = false
    }else{
      this.showModalFactureFrsPaied = true;
    }

    
  }
  closeModalFactureFrsPaied() {
    this.showModalFactureFrsPaied = false;
  }


  openModalFactureFrsNotPaied() {
    this.closeModalFactureFrsPaied();
    this.dateDebut = "";
    this.dateFin = "";

    if(this.showModalFactureFrsNotPaied == true){
      this.showModalFactureFrsNotPaied = false
    }else{
      this.showModalFactureFrsNotPaied = true;
    } 
  }

  closeModalFactureFrsNotPaied() {
    this.showModalFactureFrsNotPaied = false;
  }


  pdfData!: Blob;
  handleRenderPdf(data: any) {
    const pdfObject = PDFObject.embed(data, '#pdfContainer');
  }
  selectedCostCentre: any;
  dataCostCentre = new Array<any>();
  listCostCentrePushed = new Array<any>();
  listCostCentreRslt = new Array<any>();
  // GetCostCentre() {
  //   this.paramService.GetCostCentre().subscribe((data: any) => {

  //     this.dataCostCentre = data;
  //     this.listCostCentrePushed = [];
  //     for (let i = 0; i < this.dataCostCentre.length; i++) {
  //       this.listCostCentrePushed.push({ label: this.dataCostCentre[i].designationAr, value: this.dataCostCentre[i].code })
  //     }
  //     this.listCostCentreRslt = this.listCostCentrePushed;
  //   })
  // }

  // printV1() {
  //   // this.RemplirePrint(41);
  // }

  dateDebut: any;
  dateFin: any;
  transformDateFormatDateDebut() {
    this.dateDebut = this.datePipe.transform(this.dateDebut, "dd/MM/yyyy")

  };
  transformDateFormatDateFin() {
    this.dateFin = this.datePipe.transform(this.dateFin, "dd/MM/yyyy")
  };

  Paid: boolean = false;

  GetFactureFrsPaied(): void {
    this.Paid = true;
    // this.WsEdition.GetEditionFactureFournisseur(this.Paid, this.dateDebut, this.dateFin).subscribe(
    //   {

    //     next: (blob: Blob) => {

    //       // const url = window.URL.createObjectURL(blob);

    //       // // Attempt to open in new tab
    //       // const newTab = window.open(url, '_blank');

    //       // // Fallback to download if new tab fails (likely pop-up blocked)
    //       // if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
    //       //   const link = document.createElement('a');
    //       //   link.href = url;
    //       //   link.download = 'filename.pdf';
    //       //   link.style.display = 'none';
    //       //   document.body.appendChild(link);
    //       //   link.click();
    //       //   document.body.removeChild(link);
    //       // }
    //       // // Clean up (important)
    //       // setTimeout(() => window.URL.revokeObjectURL(url), 1000); // Delay for reliability

    //       const reader = new FileReader();
    //       const binaryString = reader.readAsDataURL(blob);
    //       reader.onload = (event: any) => {
    //         this.pdfData = event.target.result;

    //         if (this.pdfData) {
    //           this.handleRenderPdf(this.pdfData);
    //         }

    //       };

    //     },
    //     error: (error) => { // ... error handling
    //     }
    //   });
  }



  GetFactureFrsNonPaied(): void {
    this.Paid = false;
    // this.WsEdition.GetEditionFactureFournisseur(this.Paid, this.dateDebut, this.dateFin).subscribe({
    //   next: (blob: Blob) => {
    //     // const url = window.URL.createObjectURL(blob);

    //     // // Attempt to open in new tab
    //     // const newTab = window.open(url, '_blank');

    //     // // Fallback to download if new tab fails (likely pop-up blocked)
    //     // if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
    //     //   const link = document.createElement('a');
    //     //   link.href = url;
    //     //   link.download = 'filename.pdf';
    //     //   link.style.display = 'none';
    //     //   document.body.appendChild(link);
    //     //   link.click();
    //     //   document.body.removeChild(link);
    //     // }
    //     // // Clean up (important)
    //     // setTimeout(() => window.URL.revokeObjectURL(url), 1000); // Delay for reliability



    //     const reader = new FileReader();
    //     const binaryString = reader.readAsDataURL(blob);
    //     reader.onload = (event: any) => {
    //       this.pdfData = event.target.result;

    //       if (this.pdfData) {
    //         this.handleRenderPdf(this.pdfData);
    //       }

    //     };

    //   },
    //   error: (error) => { // ... error handling
    //   }
    // });
  }
}
