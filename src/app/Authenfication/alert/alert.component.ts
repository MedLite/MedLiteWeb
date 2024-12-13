import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators'; 
import { AlertService } from '../alert.service';
 

export interface AlertMessage {
  message: string;
  remove: boolean;
  type: string;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  constructor(private alertService: AlertService) {}

  alertMessages!: Observable<AlertMessage[]>;

  ngOnInit() {
    this.alertMessages= this.alertService.alertObsv$.pipe(
      scan(
        (acc: AlertMessage[], curr: AlertMessage) =>
          (acc = curr.remove ? [] : acc.concat(curr)),
        []
      )
    );
  }
}
