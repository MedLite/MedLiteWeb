import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; 
import { AlertMessage } from './alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  private alertSub$ = new Subject<any>();
  alertObsv$ = this.alertSub$.asObservable();

  pushAlert(alert: AlertMessage) {
    this.alertSub$.next(alert);
  }

}
