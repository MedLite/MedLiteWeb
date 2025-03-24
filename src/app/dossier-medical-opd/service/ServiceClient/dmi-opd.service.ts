import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DmiOpdService {

  constructor(private http: HttpClient) { }


  
    //// Examen
    GetExamen(): Observable<any> {
  
      return this.http.get(`${environment.API_EXMANE}examen/all` )
    }
  
    GetExamenByCode(code:number): Observable<any> {
  
      return this.http.get(`${environment.API_EXMANE}examen/`+code )
    }
  

    GetExamenByTypeExamenAndCodeAdmission(typeExamen:any,codeAdmission : any): Observable<any> {
  
      return this.http.get(`${environment.API_EXMANE}examen/findByTypeExamenAndCodeAdmission?typeExamen=`+typeExamen + `&codeAdmission=`+codeAdmission )
    }


    GetExamenByTypeExamenAndCodeAdmissionByCode(code: any): Observable<any> {
  
      return this.http.get(`${environment.API_EXMANE}examen/findWithDetails/`+code  )
    }


    // GetExamenByCodeForEdition(code: any): Observable<any> {
  
    //   return this.http.get(`${environment.API_EXMANE}examen/edition/`+code  )
    // }

    GetExamenByCodeForEdition(code: any) {
      return this.http.get(`${environment.API_EXMANE}examen/edition/` + code, { responseType: "blob" });
    }

   
    PostExamen(body: any) {
      return this.http.post(`${environment.API_EXMANE}examen`, body);
    } 

    PostExamenList(body: any) {
      return this.http.post(`${environment.API_EXMANE}examen/List`, body);
    } 
  


    UpdateExamen(body: any) {
      return this.http.put(`${environment.API_EXMANE}examen/update`, body);
    }
  
    DeleteExamen(code: any) {
      return this.http.delete(`${environment.API_EXMANE}examen/delete/`+code);
    }
  
  
  
}
