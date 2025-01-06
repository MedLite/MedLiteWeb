import { Component } from '@angular/core';
import { I18nService } from '../../Shared/i18n/i18n.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
constructor(public i18nService: I18nService)
{

}


}
