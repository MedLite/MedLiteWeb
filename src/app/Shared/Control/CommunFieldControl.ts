
// import { ElementRef, Injectable, ViewChild } from '@angular/core';
// import * as alertifyjs from 'alertifyjs'
// import { I18nService } from '../i18n/i18n.service';
// import { Dropdown } from 'primeng/dropdown';
// import { InputValidationService } from './ControlFieldInput';
// @Injectable({
//     providedIn: 'root' // Make the service available application-wide
// })
// export class CommunFieldControl {
//     constructor(private validationService: InputValidationService) { }

//     codeSaisie: any;
//     designationAr: string = 'NULL';
//     designationLt: string = "NULL";
//     rib!: string;
//     @ViewChild('codeInput') codeInputElement!: ElementRef;
//     @ViewChild('codeError') codeErrorElement!: ElementRef;
//     @ViewChild('codeSaisieInput') codeSaisieInputElement!: ElementRef;
//     @ViewChild('desginationArInput') desginationArInputElement!: ElementRef;
//     @ViewChild('desginationLtInput') desginationLtInputElement!: ElementRef;
//     @ViewChild('ribInput') ribInputInputElement!: ElementRef;


//     validateCodeSaisie(inputElement: ElementRef ,  value: string): boolean {
//         this.validationService.validateInput2(inputElement, this.codeErrorElement, value, 'codeSaisie');
//         if (this.codeSaisie !== null && this.codeSaisie !== undefined && this.codeSaisie.trim() !== '') {
//             inputElement.nativeElement.classList.remove('invalid-input'); // Remove error class
//             return true;
//         } else {
//             inputElement.nativeElement.classList.add('invalid-input'); // Add error class
//             this.validationService.showRequiredNotification();
//             return false;
//         }
//     }

//     validateDesignationAr(inputElement: ElementRef ,  value: string): boolean {
//         this.validationService.validateInput2(inputElement, this.codeErrorElement, value, 'DesignationAr');
//         if (value !== null && value !== undefined && value.trim() !== '') {
//             inputElement.nativeElement.classList.remove('invalid-input'); // Remove error class
//             return true;
//         } else {
//             inputElement.nativeElement.classList.add('invalid-input'); // Add error class
//             this.validationService.showRequiredNotification();
//             return false;
//         }
//     }

//     validateDesignationLt(): boolean {
//         this.validationService.validateInput2(this.desginationLtInputElement, this.codeErrorElement, value, 'codeSaisie');
//         if (value !== null && value !== undefined && value.trim() !== '') {
//             this.desginationLtInputElement.nativeElement.classList.remove('invalid-input'); // Remove error class
//             return true;
//         } else {
//             this.desginationLtInputElement.nativeElement.classList.add('invalid-input'); // Add error class
//             this.validationService.showRequiredNotification();
//             return false;
//         }
//     }

//     validateRib(): boolean {
//         this.validationService.validateInput2(this.ribInputInputElement, this.codeErrorElement, this.rib, 'codeSaisie');
//         if (this.rib !== null && this.rib !== undefined && this.rib.trim() !== '') {
//             this.ribInputInputElement.nativeElement.classList.remove('invalid-input'); // Remove error class
//             return true;
//         } else {
//             this.ribInputInputElement.nativeElement.classList.add('invalid-input'); // Add error class
//             this.validationService.showRequiredNotification();
//             return false;
//         }
//     }
// }


