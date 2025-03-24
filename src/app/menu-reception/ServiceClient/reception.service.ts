 
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




  
  //// PlanningCabinet
  GetPlanningCabinetAll(): Observable<any> {

    return this.http.get(`${environment.API_Reception}planning_cabinet/all` )
  }
  GetPlanningCabinetByActif(actif : boolean): Observable<any> {

    return this.http.get(`${environment.API_Reception}planning_cabinet/findBy?actif=`+actif )
  }
  

  GetPlanningCabinetByActifAndDateExiste(actif : any,dateDebut : any , dateFin :any): Observable<any> {

    return this.http.get(`${environment.API_Reception}planning_cabinet/findByDateAndActif?actif=`+actif + `&dateDebut=`+dateDebut + `&dateFin=`+dateFin )
  }
  GetPlanningCabinetByDateExiste(dateDebut : any , dateFin :any): Observable<any> {

    return this.http.get(`${environment.API_Reception}planning_cabinet/findByDate?dateDebut=`+dateDebut + `&dateFin=`+dateFin )
  }
  

  GetPlanningCabinetByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Reception}planning_cabinet/`+code )
  }

  GetPlanningCabinetByDate(dateDispo:any,dateFin:any): Observable<any> {

    return this.http.get(`${environment.API_Reception}planning_cabinet/findByDate?dateDebut=`+dateDispo`&dateFin=`+dateFin)
  }

  PostPlanningCabinet(body: any) {
    return this.http.post(`${environment.API_Reception}planning_cabinet`, body);
  } 

  PostPlanningCabinetList(body: any) {
    return this.http.post(`${environment.API_Reception}planning_cabinet/List`, body);
  } 


  UpdatePlanningCabinet(body: any) {
    return this.http.put(`${environment.API_Reception}planning_cabinet/update`, body);
  }

  DeletePlanningCabinet(code: any) {
    return this.http.delete(`${environment.API_Reception}planning_cabinet/delete/`+code);
  }

 
  //// Admission
  GetAdmission(): Observable<any> {

    return this.http.get(`${environment.API_Reception}admission/all` )
  }

  GetAdmissionByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Reception}admission/`+code )
  }
  GetAdmissionByCodeNatureAdmission(codeNatureAdmission : any): Observable<any> {

    return this.http.get(`${environment.API_Reception}admission/findByCodeNatureAdmission?codeNatureAdmission=`+codeNatureAdmission )
  }

 
  PostAdmission(body: any) {
    return this.http.post(`${environment.API_Reception}admission`, body);
  } 
  UpdateAdmission(body: any) {
    return this.http.put(`${environment.API_Reception}admission/update`, body);
  }

  DeleteAdmission(code: any) {
    return this.http.delete(`${environment.API_Reception}admission/delete/`+code);
  }


  // reglemnet
  GetReglement(): Observable<any> {

    return this.http.get(`${environment.API_Caisse}reglement/all` )
  }

  GetReglementByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Reception}reglement/`+code )
  }
 
  PostReglement(body: any) {
    return this.http.post(`${environment.API_Reception}reglement`, body);
  } 
  UpdateReglement(body: any) {
    return this.http.put(`${environment.API_Reception}reglement/update`, body);
  }

  DeleteReglement(code: any) {
    return this.http.delete(`${environment.API_Reception}reglement/delete/`+code);
  }

}
