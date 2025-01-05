import { Component } from '@angular/core';
import { I18nService } from '../Shared/i18n/i18n.service';

@Component({
  selector: 'app-menu-parametrage',
  templateUrl: './menu-parametrage.component.html',
  styleUrls: ['./menu-parametrage.component.css','.../../../src/assets/css/BS.css','.../../../src/assets/css/BS3.7.css']
})
export class MenuParametrageComponent {
  showSubmenu: boolean = false;
  constructor(public i18nService: I18nService){}
}
