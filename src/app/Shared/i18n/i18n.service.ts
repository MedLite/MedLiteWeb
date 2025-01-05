import { Injectable, Inject } from '@angular/core'; 
import { i18nConfigService } from './i18n-config.service';
@Injectable(
  // {providedIn: 'root'}
 
)
export class I18nService {

  currentLanguage :any = '';

  constructor(@Inject(i18nConfigService) public langList:any) {
    this.initLang();
  }

  initLang() {
    if (sessionStorage.getItem('lang')) { 
      this.currentLanguage = sessionStorage.getItem('lang');
    } else {
      sessionStorage.setItem('lang', 'ar');
      this.currentLanguage = 'ar';
    }
  }

  getString(key:any) {
    return this.langList[this.langList.map(( e:any, i:any) => e.valeur === this.currentLanguage ? i : null).filter((e:any) => e !== null)[0]].file.default[key];
  }

  languageChange(valeur:any) {
    this.currentLanguage = valeur;
    sessionStorage.setItem('lang', valeur);
  }
}
