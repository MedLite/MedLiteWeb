import { Component, Input } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

  @Input('IsLoading') IsLoading:boolean = true;
   constructor(public i18nService: I18nService) { }
}
