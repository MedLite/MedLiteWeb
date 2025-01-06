import {  AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { I18nService } from '../Shared/i18n/i18n.service';
 
import { MatMenuTrigger } from '@angular/material/menu';

declare const $: any;
@Component({
  selector: 'app-menu-parametrage',
  templateUrl: './menu-parametrage.component.html',
  styleUrls: ['./menu-parametrage.component.css' , '.../../../src/assets/css/StyleMenu.css'
    , '.../../../src/assets/css/BS.css', '.../../../src/assets/css/BS3.7.css']
})
export class MenuParametrageComponent     {
  showSubmenu: boolean = false;
  constructor(public i18nService: I18nService ) { }
 
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
  @ViewChildren('.block2') block2Elements!: QueryList<ElementRef>;

  // ngAfterViewInit() {
  //   this.menuTriggers.changes.subscribe(() => {
  //     this.menuTriggers.forEach((trigger, index) => {
  //       trigger.menuOpened.subscribe(() => this.toggleActive(index));
  //       trigger.menuClosed.subscribe(() => this.toggleActive(index));
  //     });
  //   });
  //   this.block2Elements.changes.subscribe(() => {
  //     //Optional:  Add a check here to ensure both QueryLists are populated if needed for other operations
  //   });
  // }

  // private toggleActive(index: number) {
  //   if (this.block2Elements && this.block2Elements.toArray()[index]) {
  //     this.block2Elements.toArray()[index].nativeElement.classList.toggle('active');
  //   } else {
  //     console.error("Error: block2Elements not found at index:", index);
  //   }
  // }
}
