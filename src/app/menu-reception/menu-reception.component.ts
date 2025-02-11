import { Component } from '@angular/core';
import { I18nService } from '../Shared/i18n/i18n.service';


@Component({
  selector: 'app-menu-reception',
  templateUrl: './menu-reception.component.html',
  styleUrls:[ './menu-reception.component.css', '.../../../src/assets/css/StyleMenu.css'
    , '.../../../src/assets/css/BS.css', '.../../../src/assets/css/BS3.7.css']
})
export class MenuReceptionComponent {

  showSubmenu: boolean = false;
  constructor(public i18nService: I18nService) { }
  
  IsOpened = false;
  onOpened() { 
    this.IsOpened = true;
  } 
  onClosed() { 
    this.IsOpened = false; 
  } 


  IsOpened2 = false;
  onOpened2() { 
    this.IsOpened2 = true;
  } 
  onClosed2() { 
    this.IsOpened2 = false; 
  } 

  IsOpened3 = false;
  onOpened3() { 
    this.IsOpened3 = true;
  } 
  onClosed3() { 
    this.IsOpened3 = false; 
  } 

  IsOpened4 = false;
  onOpened4() { 
    this.IsOpened4 = true;
  } 
  onClosed4() { 
    this.IsOpened4 = false; 
  } 

  IsOpened5 = false;
  onOpened5() { 
    this.IsOpened5 = true;
  } 
  onClosed5() { 
    this.IsOpened5 = false; 
  } 

  IsOpened6 = false;
  onOpened6() { 
    this.IsOpened6 = true;
  } 
  onClosed6() { 
    this.IsOpened6 = false; 
  } 

}
