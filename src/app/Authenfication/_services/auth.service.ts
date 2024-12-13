import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
// import { AuthClientService } from '../auth-client.service';
import { Router } from '@angular/router'; 
 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  login(userName: string, password: string): Observable<any> { 
    return this.http.post(`${environment.API_ACCESS}` + 'login', {
      userName,
      password
    }, httpOptions);
  }

  logout(idUser:any) {
    return this.http.post(`${environment.API_ACCESS}` + 'signout/' + idUser , httpOptions);
  }

 
  
   
}
