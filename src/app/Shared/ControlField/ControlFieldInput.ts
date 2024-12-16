import { ElementRef, Injectable } from '@angular/core';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../i18n/i18n.service';
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
      if (inputElement) {
        inputElement.nativeElement.classList.remove('invalid-input');
      }
    }

    if (errorMessageContainer) {
      errorMessageContainer.nativeElement.textContent = errorMessage; // Set the error message in the specified container (optional)
    } else {
      // Handle cases where errorMessageContainer isn't provided (e.g. console log)
      if (errorMessage) {
        console.warn(errorMessage)
      }
    }



  }


  showRequiredNotification() {
    const fieldRequiredMessage = this.i18nService.getString('fieldRequired');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }
}