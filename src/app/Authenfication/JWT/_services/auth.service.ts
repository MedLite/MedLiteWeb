import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { StorageService } from './storage.service';

 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(   private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    return this.http.post(
       `${environment.API_AUTH}`  + 'login',
      {
        userName,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${environment.API_ACCESS}`  + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.API_ACCESS}` + 'signout', { }, httpOptions);
  }
 
  refreshToken(refreshToken: any,userId:any) {
  
    return this.http.post(`${environment.API_ACCESS}`  + 'refreshtoken', { refreshToken ,userId}, httpOptions);
  }

  GetImageProfil(){
    
    const username = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.userName?.toLowerCase();
    return this.http.get(`${environment.API_AUTH}`  + 'accessUser/imageProfil?userName='+ username);

  }



}
