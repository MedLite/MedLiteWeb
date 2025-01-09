import { ElementRef, Injectable } from '@angular/core';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../i18n/i18n.service';
@Injectable({
  providedIn: 'root' // Make the service available application-wide
})
export class ControlServiceAlertify {
  private lastNotificationTime = 0;
  constructor(public i18nService: I18nService) { }

   


  showRequiredNotification() {
    const fieldRequiredMessage = this.i18nService.getString('fieldRequired');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }


  
  showRequiredNotificationِCustom(LabelMessage:string) {
    const fieldRequiredMessage = this.i18nService.getString(LabelMessage);  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }
  showLabel(){
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      if (sessionStorage.getItem("lang") == "ar") {
        alertifyjs.set('notifier', 'position', 'top-left');
      } else {
        alertifyjs.set('notifier', 'position', 'top-right');
      }
    }
  }

  showChoseAnyRowNotification() {
    const fieldRequiredMessage = this.i18nService.getString('SelctAnyRow');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }

  showChoseAnyPatientNotification() {
    const fieldRequiredMessage = this.i18nService.getString('SelectAnyPatient');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }

  ShowSavedOK(){
    const fieldSavedMessage = this.i18nService.getString('SuccessSaved');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldSavedMessage
    ); 
  }
  ShowUpdatedOK(){
    const fieldUpdatedMessage = this.i18nService.getString('UpdatedOK');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldUpdatedMessage
    ); 
  }


  ShowDeletedOK(){
    const fieldUpdatedMessage = this.i18nService.getString('DeletedOK');  
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldUpdatedMessage
    ); 
  }
}