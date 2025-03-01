import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PatientSelectionService {
  private _selectedPatientCode = new BehaviorSubject<string | null>(null);
  selectedPatientCode$ = this._selectedPatientCode.asObservable();

  private _selectedPatientName = new BehaviorSubject<string | null>(null);
  selectedPatientName$ = this._selectedPatientName.asObservable();

  setSelectedPatientCode(codePatient: string  ) {
    this._selectedPatientCode.next(codePatient);
  }

  setSelectedPatientName(PatientName: string  ) {
    this._selectedPatientName.next(PatientName);
  }
}