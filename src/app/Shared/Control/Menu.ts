import { ElementRef, Injectable } from '@angular/core';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../i18n/i18n.service';
import { Dropdown } from 'primeng/dropdown';
@Injectable({
  providedIn: 'root' // Make the service available application-wide
})
export class MenuExp { 
  constructor() { } 

  ExpendMatIconMenu(inputElement: ElementRef): void {
    const matIcon = inputElement.nativeElement.querySelector('.mat-icon[aria-expanded]');
    if (matIcon) {
      const block2 = matIcon.closest('.block2');
      if (matIcon.getAttribute('aria-expanded') == 'true') {
        block2?.classList.add('active');
      } else {
        block2?.classList.remove('active');
      }
    }
  }
 

}