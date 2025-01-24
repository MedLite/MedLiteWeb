import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { UserService } from '../../Authenfication/_services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface LogoData {
  code: number;
  logo: string;
  nomSociete: string;
  imagePath: string | null;
}


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(public i18nService: I18nService, public societe: UserService, private _sanitizer: DomSanitizer) { }
  logo: SafeResourceUrl | string | null = null; //Make sure it is initialized

  ngOnInit(): void {
    this.GetLogo();
  }

 
  GetLogo() {
    this.societe.GetLogoClinique().subscribe(
      (data: any) => {
        
        if (typeof data.logo === 'string' && data.logo.trim() !== '') {
          this.logo = this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpg;base64,${data.logo}`);
        } else {
          console.error("Invalid logo data received.");
          this.logo = '/path/to/default/logo.png'; //Fallback to default
        }

      }
    )
 
  }


}
