import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PatientSelectionService {
  private _selectedCodeAdmission = new BehaviorSubject<string | null>(null);
  selectedAdmissionCode$ = this._selectedCodeAdmission.asObservable();

  private _selectedPatientName = new BehaviorSubject<string | null>(null);
  selectedPatientName$ = this._selectedPatientName.asObservable();


  private _selectedcodeSaisiePatient = new BehaviorSubject<string | null>(null);
  selectedcodeSaisiePatient$ = this._selectedcodeSaisiePatient.asObservable();


  setSelectedCodeAdmission(codeAdmission: string  ) {
    this._selectedCodeAdmission.next(codeAdmission);
  }

  setSelectedPatientName(PatientName: string  ) {
    this._selectedPatientName.next(PatientName);
  }
  setSelectedCodePatient(codeSaisiePatient: string  ) {
    this._selectedcodeSaisiePatient.next(codeSaisiePatient);
  }


}