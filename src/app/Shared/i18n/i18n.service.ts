import { Injectable, Inject } from '@angular/core';
// import frI18n from '../../assets/i18n/fr.i18n';
// import enI18n from '../../assets/i18n/en.i18n';
import { i18nConfigService } from './i18n-config.service';
import { HttpClient } from '@angular/common/http';
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
      // console.log('getting old lang')
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
