 
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {

constructor(private http: HttpClient) { }
  


  //// Patient
  GetPatient(): Observable<any> {

    return this.http.get(`${environment.API_Reception}patient/all` )
  }

  GetPatientByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Reception}patient/`+code )
  }

  GetPatientByNomLike(nomPatient:string): Observable<any> {

    return this.http.get(`${environment.API_Reception}patient/q?nomPatient=`+nomPatient )
  }

  PostPatient(body: any) {
    return this.http.post(`${environment.API_Reception}patient`, body);
  } 
  UpdatePatient(body: any) {
    return this.http.put(`${environment.API_Reception}patient/update`, body);
  }

  DeletePatient(code: any) {
    return this.http.delete(`${environment.API_Reception}patient/delete/`+code);
  }





}
