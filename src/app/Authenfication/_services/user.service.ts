import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { environment } from '../../../environments/environment.development';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  // getPublicContent(): Observable<any> {
  //   return this.http.get(API_URL + 'all', { responseType: 'text' });
  // }

  // getUserBoard(): Observable<any> {
  //   return this.http.get(API_URL + 'user', { responseType: 'text' });
  // }

  // getModeratorBoard(): Observable<any> {
  //   return this.http.get(API_URL + 'mod', { responseType: 'text' });
  // }

  // getAdminBoard(): Observable<any> {
  //   return this.http.get(API_URL + 'admin', { responseType: 'text' });
  // }


  PostUser(body: any) {
    return this.http.post(`${environment.API_ACCESS}accessUser`, body);
  }
  UpdateUser(body: any) {

    return this.http.put(`${environment.API_ACCESS}accessUser/update`, body);
  }
  GetUser() {

    return this.http.get(`${environment.API_ACCESS}accessUser/all`);
  }
  GetUserWithPassword() {

    return this.http.get(`${environment.API_ACCESS}accessUser/allWithPass`);
  }



  GetLogoClinique() {

    return this.http.get(`${environment.API_SOC}/logos/1`);
  }




}
