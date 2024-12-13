import { HttpClient, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, share, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
 

const TOKEN_KEY = 'auth-token';
const USER_ID = 'USER-ID';
const USER_KEY = 'auth-user';
const fresh_Token = 'RefTok';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

 

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(private http: HttpClient) { }

  signOut(): void {
    window.sessionStorage.clear();
  }
 
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);


  }

  public SaveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(fresh_Token);
    window.sessionStorage.setItem(fresh_Token, token);

  }

  public saveUserID(token: string): void {
    window.sessionStorage.removeItem(USER_ID);
    window.sessionStorage.setItem(USER_ID, token);

  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  private tokenExpirationSubject = new BehaviorSubject<null>(null);
  tokenExpiration$ = this.tokenExpirationSubject.asObservable();

  // ... other authentication methods
  token: any;
  isTokenExpired(): boolean {
    this.token = this.getToken(); // Get token
    if (this.token) {
      const tokenExpiration = new Date(this.token.exp * 1000); // Assuming exp is in seconds
      return new Date() >= tokenExpiration;
    }
    return true; // Consider token expired if it's not found
  }

  onTokenExpired(): void {
    this.tokenExpirationSubject.next(null); // Emit event
  }
  // refresh:any;
  //   refreshToken(refres:any): Observable<string> {
  //     return this.http.post<any>(`${environment.API_ACCESS}` + '/refreshtoken/'+refres, {}, { withCredentials: true })
  //       .pipe(
  //         share(),
  //         map((authResponse) => {
  //           // this.currentAuthSubject.next(authResponse);
  //           // this.addToLocalStorage(authResponse);
  //           console.log("authResponse",authResponse)
  //           return authResponse.token;
  //         }));
  // }

    accessToken!: string;
    refreshTokens!: string;
    

    // logout(idUser:any) {
    //   return this.http.post(`${environment.API_ACCESS}` + 'signout/' + idUser , httpOptions);
    // }

    
  refreshToken(): Observable<any> {
  
    return this.http.post(`${environment.API_ACCESS}` + 'refreshtoken' , httpOptions)
       ;
      
  }

  
  // refreshToken2(): Observable<JwtResponse> {
  //   return this.http.post<JwtResponse>(`${environment.API_ACCESS}` + 'refreshtoken', {}, httpOptions);
  // }
}
