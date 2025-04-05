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
  
  

    /// cheif complaint 


    PostCheifComplaint(body: any) {
      return this.http.post(`${environment.API_DMI}cheif_complaint`, body);
    } 
  

    GetCheifComplaintByCodeAdmission(codeAdmission : any) {
      return this.http.get(`${environment.API_DMI}cheif_complaint/findByCodeAdmission?codeAdmission=`+codeAdmission);
    } 
    DeleteCheifComplaint (code: any) {
      return this.http.delete(`${environment.API_DMI}cheif_complaint/delete/`+code);
    }

    DeleteCheifComplaintByCodeAdmission(codeAdmission: any) {
      return this.http.delete(`${environment.API_DMI}cheif_complaint/deleteByCodeAdmission/`+codeAdmission);
    }
  
  

    
    /// Allergy 


    PostAllergy(body: any) {
      return this.http.post(`${environment.API_DMI}allergy`, body);
    } 
  

    GetAllergyByCodeAdmission(codeAdmission : any) {
      return this.http.get(`${environment.API_DMI}allergy/findByCodeAdmission?codeAdmission=`+codeAdmission);
    } 
    DeleteAllergy (code: any) {
      return this.http.delete(`${environment.API_DMI}allergy/delete/`+code);
    }

    DeleteAllergyByCodeAdmission(codeAdmission: any) {
      return this.http.delete(`${environment.API_DMI}allergy/deleteByCodeAdmission/`+codeAdmission);
    }


      /// Diagnosis 


      PostDiagnosis(body: any) {
        return this.http.post(`${environment.API_DMI}diagnosis`, body);
      } 
    
  
      GetDiagnosisByCodeAdmission(codeAdmission : any) {
        return this.http.get(`${environment.API_DMI}diagnosis/findByCodeAdmission?codeAdmission=`+codeAdmission);
      } 
      DeleteDiagnosis (code: any) {
        return this.http.delete(`${environment.API_DMI}diagnosis/delete/`+code);
      }
  
      DeleteDiagnosisByCodeAdmission(codeAdmission: any) {
        return this.http.delete(`${environment.API_DMI}diagnosis/deleteByCodeAdmission/`+codeAdmission);
      }


      
      /// History 


      PostHistory(body: any) {
        return this.http.post(`${environment.API_DMI}past_history`, body);
      } 
    
  
      GetHistoryByCodeAdmission(codeAdmission : any) {
        return this.http.get(`${environment.API_DMI}past_history/findByCodeAdmission?codeAdmission=`+codeAdmission);
      } 
      DeleteHistory (code: any) {
        return this.http.delete(`${environment.API_DMI}past_history/delete/`+code);
      }
  
      DeleteHistoryByCodeAdmission(codeAdmission: any) {
        return this.http.delete(`${environment.API_DMI}past_history/deleteByCodeAdmission/`+codeAdmission);
      }


      //// Reports 

      GetReports() { 
        return this.http.get(`${environment.API_REPORTS}/Pages/ReportViewer.aspx?%2fTest%2fnew&codeAdmission=5` , { responseType: "blob"  
         });
      } 
}
