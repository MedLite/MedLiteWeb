import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuParametrageRoutingModule } from './menu-parametrage-routing.module';
import { MenuParametrageComponent } from './menu-parametrage.component'; 
import { TagModule } from 'primeng/tag';
import { MatIconModule } from '@angular/material/icon'
import {MatMenuModule} from '@angular/material/menu';  
import { I18nPipeForMenu } from '../Shared/i18n/i18nForMenu.pipe';
@NgModule({
  declarations: [
    MenuParametrageComponent,I18nPipeForMenu

  
  ],
  imports: [
    CommonModule,TagModule,MatIconModule,MatMenuModule,
 
    MenuParametrageRoutingModule
  ],
  
})
export class MenuParametrageModule { }
