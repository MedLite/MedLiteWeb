import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  template: `
    <div class="custom-select-container"   (click)="toggleTable()">
      <div class="selected-value">{{ selectedValue }}  </div>
      <div *ngIf="showTable" class="custom-select-table">
        <table>
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th> 
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data" (click)="selectRow(row[2])">
              <td (click)="selectRow(row[2])">{{ row.codeSaisie }}</td>
              <td (click)="selectRow(row[2])">{{ row.designationAr }}</td>
              
            
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .custom-select-container {
      position: relative; 
      cursor: pointer;  
      width:100px;
    }

    .selected-value {
        text-align: right !important;
    border: 1px solid #bfbfbf !important;
    border-width: 1px 1px 1px 1px !important;
    padding: 2px 5px 0px !important;
    font-size: 15px !important;
    height: 25px !important;
    font-family: auto;
      display: block;
      width:100px;
    }

    .custom-select-table {
      position: absolute;
      top: 100%;
      right: 0px;
      border: 1px solid black;
      background-color: white;
      z-index: 100;
      width: 250px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid black;
      padding: 8px;
      text-align: left;
    }

    tr:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class CustomSelectComponent {
  @Output() valueChange = new EventEmitter<string>();
  @Output() showTableChange = new EventEmitter<boolean>(); 
 
  @Input() data: any[] = [];
  showTable = false;
  selectedValue: string = ""; // Use 'selectedValue' consistently

  toggleTable() {
    this.showTable = !this.showTable;
    this.showTableChange.emit(this.showTable);
  }

  selectRow(value: any) {
    console.log("value      " , value , "selectedValue   " , this.selectedValue)
    this.selectedValue = value.code; // Use 'selectedValue'
    this.showTable = !this.showTable;
    this.valueChange.emit(value);
    this.showTableChange.emit(this.showTable);
  }
}