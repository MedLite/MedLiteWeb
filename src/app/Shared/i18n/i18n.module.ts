import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { I18nService } from './i18n.service';
import { i18nConfigService } from './i18n-config.service';



@NgModule({
  declarations: [
    // I18nPipe,
    // I18nComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ // Make sure to export if you want to use them elsewhere
    // I18nPipe
  ]
})
export class I18nModule {

  static forRoot(config:any): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
      providers: [
        I18nService,
        {
          provide: i18nConfigService,
          useValue: config
        }
      ]
    }
  }
}
