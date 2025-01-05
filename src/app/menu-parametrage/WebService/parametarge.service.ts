import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParametargeService {

  constructor(private http: HttpClient) { }
  


  GetCompteur(code:string): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}compteur/`+code )
  }



  //// Banque
  GetBanque(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}banque/all` )
  }

  GetBanqueByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}banque/`+code )
  }

  PostBanque(body: any) {
    return this.http.post(`${environment.API_Parametrage}banque`, body);
  } 
  UpdateBanque(body: any) {
    return this.http.put(`${environment.API_Parametrage}banque/update`, body);
  }

  DeleteBanque(code: any) {
    return this.http.delete(`${environment.API_Parametrage}banque/delete/`+code);
  }


  
  //// Cabinet
  GetCabinet(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}cabinet/all` )
  }

  GetCabinetByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}cabinet/`+code )
  }

  PostCabinet(body: any) {
    return this.http.post(`${environment.API_Parametrage}cabinet`, body);
  } 
  UpdateCabinet(body: any) {
    return this.http.put(`${environment.API_Parametrage}cabinet/update`, body);
  }

  DeleteCabinet(code: any) {
    return this.http.delete(`${environment.API_Parametrage}cabinet/delete/`+code);
  }


  
  //// SpecialiteCabinet
  GetSpecialiteCabinet(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_cabinet/all` )
  }

  GetSpecialiteCabinetByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_cabinet/`+code )
  }

  PostSpecialiteCabinet(body: any) {
    return this.http.post(`${environment.API_Parametrage}specialite_cabinet`, body);
  } 
  UpdateSpecialiteCabinet(body: any) {
    return this.http.put(`${environment.API_Parametrage}specialite_cabinet/update`, body);
  }

  DeleteSpecialiteCabinet(code: any) {
    return this.http.delete(`${environment.API_Parametrage}specialite_cabinet/delete/`+code);
  }


  
  //// SpecialiteMedecin
  GetSpecialiteMedecin(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_medecin/all` )
  }

  GetSpecialiteMedecinByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_medecin/`+code )
  }

  PostSpecialiteMedecin(body: any) {
    return this.http.post(`${environment.API_Parametrage}specialite_medecin`, body);
  } 
  UpdateSpecialiteMedecin(body: any) {
    return this.http.put(`${environment.API_Parametrage}specialite_medecin/update`, body);
  }

  DeleteSpecialiteMedecin(code: any) {
    return this.http.delete(`${environment.API_Parametrage}specialite_medecin/delete/`+code);
  }


}
