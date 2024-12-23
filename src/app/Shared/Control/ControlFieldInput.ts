import { ElementRef, Injectable } from '@angular/core';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../i18n/i18n.service';
import { Dropdown } from 'primeng/dropdown';
@Injectable({
  providedIn: 'root' // Make the service available application-wide
})
export class InputValidationService {
  private lastNotificationTime = 0;
  constructor(public i18nService: I18nService) { }

  validateInput(inputElement: ElementRef, errorMessageContainer: ElementRef | undefined, value: string, fieldName: string): void {
    let errorMessage = ''; 
    if (value === '') {
      errorMessage = `${fieldName} is required`;
      if (inputElement) {
        inputElement.nativeElement.classList.add('invalid-input'); 
        const currentTime = Date.now();
        if (currentTime - this.lastNotificationTime > 2000) {  
          this.lastNotificationTime = currentTime;
          if (sessionStorage.getItem("lang") == "ar") {
            alertifyjs.set('notifier', 'position', 'top-left');
          } else {
            alertifyjs.set('notifier', 'position', 'top-right');
          } 
          this.showRequiredNotification();
        } 
      }
    } else {
      if (inputElement) {
        inputElement.nativeElement.classList.remove('invalid-input');
      }
    } 
    if (errorMessageContainer) {
      errorMessageContainer.nativeElement.textContent = errorMessage; // Set the error message in the specified container (optional)
    } else { 
      if (errorMessage) {
        console.warn(errorMessage)
      }
    } 
  }

  validateInput2(inputElement: ElementRef, errorMessageContainer: ElementRef | undefined, value: string, fieldName: string): boolean {
    let isValid = true;
    let errorMessage = '';

    if (!value) { // Check for empty or null/undefined
      errorMessage = `${fieldName} is required`;
      inputElement.nativeElement.classList.add('invalid-input');
      if (sessionStorage.getItem("lang") == "ar") {
        alertifyjs.set('notifier', 'position', 'top-left');
      } else {
        alertifyjs.set('notifier', 'position', 'top-right');
      } 
      this.showRequiredNotification();
      isValid = false;
    } else {
      inputElement.nativeElement.classList.remove('invalid-input');
    }

    if (errorMessageContainer) {
      errorMessageContainer.nativeElement.textContent = errorMessage;
    }else { 
      if (errorMessage) {
        console.warn(errorMessage)
      }
    } 

    return isValid; // Correctly returns a boolean
}

  validateDropDownInput(inputElement: Dropdown, errorMessageContainer: Dropdown | undefined, value: string, fieldName: string): void {
    let errorMessage = '';

    if (value === "" || value === undefined || value === null) {
      errorMessage = `${fieldName} is required`;
      if (inputElement && inputElement.containerViewChild) {
        inputElement.containerViewChild.nativeElement.classList.add('InvalidData'); 
        const currentTime = Date.now();
        if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
          this.lastNotificationTime = currentTime;
          if (sessionStorage.getItem("lang") == "ar") {
            alertifyjs.set('notifier', 'position', 'top-left');
          } else {
            alertifyjs.set('notifier', 'position', 'top-right');
          }

          this.showRequiredNotification();
        }



      }
    } else {
      if (inputElement && inputElement.containerViewChild) {
        inputElement.containerViewChild.nativeElement.classList.remove('InvalidData');
      }
    }

    if (errorMessageContainer && errorMessageContainer.containerViewChild) {
      errorMessageContainer.containerViewChild.nativeElement.textContent = errorMessage; // Set the error message in the specified container (optional)
    } else {
      // Handle cases where errorMessageContainer isn't provided (e.g. console log)
      if (errorMessage) {
        console.warn(errorMessage)
      }
    }


    // if (this.modeReglementInputElement && this.modeReglementInputElement.containerViewChild) { // Check if containerViewChild exists
    //   if (this.selectedModeReglement == undefined || this.selectedModeReglement == null || this.selectedModeReglement == '') {
    //     this.modeReglementInputElement.overlayVisible = true;
    //     this.cdr.detectChanges();
    //     this.modeReglementInputElement.containerViewChild.nativeElement.classList.add('InvalidData');
    //   } else {
    //     this.modeReglementInputElement.containerViewChild.nativeElement.classList.remove('InvalidData');
    //   }
    // } else {
    //   console.warn("Dropdown not yet initialized for validation.");
    // }



  }


  showRequiredNotification() {
    const fieldRequiredMessage = this.i18nService.getString('fieldRequired');  // Default to English if not found
<<<<<<< HEAD
    
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;

        alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
    }

  
=======
    if (sessionStorage.getItem("lang") == "ar") {
      alertifyjs.set('notifier', 'position', 'top-left');
    } else {
      alertifyjs.set('notifier', 'position', 'top-right');
    }
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
     alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }  
  }
  showRequiredNotificationWithParam(fieldEnvoyer:string) {
    const fieldRequiredMessage = this.i18nService.getString(fieldEnvoyer);  // Default to English if not found
    if (sessionStorage.getItem("lang") == "ar") {
      alertifyjs.set('notifier', 'position', 'top-left');
    } else {
      alertifyjs.set('notifier', 'position', 'top-right');
    }
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
     alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }  
>>>>>>> f612864be09530092b034adcf3fddc2c33fc4396
  }
}